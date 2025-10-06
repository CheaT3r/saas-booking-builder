import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, BookingType } from '../entities/booking.entity';
import { Service } from '../entities/service.entity';
import { Staff } from '../entities/staff.entity';
import { CurrentTenantId } from '../common/decorators/tenant.decorator';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: any, tenantId: string): Promise<any> {
    // Check for availability conflicts
    await this.checkAvailability(
      createBookingDto.staffId,
      createBookingDto.startTime,
      createBookingDto.endTime,
      tenantId,
    );

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      tenantId,
      cancelToken: this.generateUniqueToken(),
      rescheduleToken: this.generateUniqueToken(),
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(
    tenantId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      staffId?: string;
      serviceId?: string;
      status?: BookingStatus;
    },
  ): Promise<Booking[]> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.staff', 'staff')
      .leftJoinAndSelect('booking.customer', 'customer')
      .where('booking.tenantId = :tenantId', { tenantId })
      .orderBy('booking.startTime', 'ASC');

    if (filters) {
      if (filters.startDate) {
        queryBuilder.andWhere('booking.startTime >= :startDate', { startDate: filters.startDate });
      }
      if (filters.endDate) {
        queryBuilder.andWhere('booking.startTime <= :endDate', { endDate: filters.endDate });
      }
      if (filters.staffId) {
        queryBuilder.andWhere('booking.staffId = :staffId', { staffId: filters.staffId });
      }
      if (filters.serviceId) {
        queryBuilder.andWhere('booking.serviceId = :serviceId', { serviceId: filters.serviceId });
      }
      if (filters.status) {
        queryBuilder.andWhere('booking.status = :status', { status: filters.status });
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, tenantId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, tenantId },
      relations: ['service', 'staff', 'customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: any, tenantId: string): Promise<Booking> {
    const booking = await this.findOne(id, tenantId);

    if (updateBookingDto.startTime || updateBookingDto.endTime) {
      // Check for conflicts if time is being changed
      const newStartTime = updateBookingDto.startTime || booking.startTime;
      const newEndTime = updateBookingDto.endTime || booking.endTime;
      
      await this.checkAvailability(
        booking.staffId,
        newStartTime,
        newEndTime,
        tenantId,
        booking.id, // Exclude current booking from conflict check
      );
    }

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const booking = await this.findOne(id, tenantId);
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    await this.bookingRepository.save(booking);
  }

  async cancelByToken(token: string, reason?: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { cancelToken: token },
      relations: ['service', 'staff', 'customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    if (reason) {
      booking.cancelReason = reason;
    }

    return this.bookingRepository.save(booking);
  }

  async checkAvailability(
    staffId: string,
    startTime: Date,
    endTime: Date,
    tenantId: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
      .where('booking.staffId = :staffId', { staffId })
      .andWhere('booking.tenantId = :tenantId', { tenantId })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] 
      })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await queryBuilder.getOne();

    if (conflictingBooking) {
      throw new ConflictException('Time slot is not available');
    }

    return true;
  }

  async getAvailableSlots(
    serviceId: string,
    staffId: string,
    date: Date,
    tenantId: string,
  ): Promise<string[]> {
    // This is a simplified version - in production you'd need to consider:
    // Staff working hours, breaks, service duration, existing bookings, etc.
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.staffId = :staffId', { staffId })
      .andWhere('booking.tenantId = :tenantId', { tenantId })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] 
      })
      .andWhere('booking.startTime >= :dayStart', { dayStart })
      .andWhere('booking.startTime < :dayEnd', { dayEnd })
      .getMany();

    // Generate available time slots (simplified logic)
    const availableSlots = [];
    const businessStart = new Date(date);
    businessStart.setHours(9, 0, 0, 0); // 9 AM start
    
    const businessEnd = new Date(date);
    businessEnd.setHours(17, 0, 0, 0); // 5 PM end

    const slotDuration = 30; // 30 minutes slots

    let currentSlot = new Date(businessStart);
    while (currentSlot < businessEnd) {
      const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60000);
      
      const isAvailable = !bookings.some(booking => 
        (booking.startTime < slotEnd && booking.endTime > currentSlot)
      );

      if (isAvailable) {
        availableSlots.push(currentSlot.toTimeString().slice(0, 5));
      }

      currentSlot = new Date(currentSlot.getTime() + slotDuration * 60000);
    }

    return availableSlots;
  }

  private generateUniqueToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}