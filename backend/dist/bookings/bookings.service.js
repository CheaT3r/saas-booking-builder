"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
let BookingsService = class BookingsService {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async create(createBookingDto, tenantId) {
        await this.checkAvailability(createBookingDto.staffId, createBookingDto.startTime, createBookingDto.endTime, tenantId);
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            tenantId,
            cancelToken: this.generateUniqueToken(),
            rescheduleToken: this.generateUniqueToken(),
        });
        return this.bookingRepository.save(booking);
    }
    async findAll(tenantId, filters) {
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
    async findOne(id, tenantId) {
        const booking = await this.bookingRepository.findOne({
            where: { id, tenantId },
            relations: ['service', 'staff', 'customer'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async update(id, updateBookingDto, tenantId) {
        const booking = await this.findOne(id, tenantId);
        if (updateBookingDto.startTime || updateBookingDto.endTime) {
            const newStartTime = updateBookingDto.startTime || booking.startTime;
            const newEndTime = updateBookingDto.endTime || booking.endTime;
            await this.checkAvailability(booking.staffId, newStartTime, newEndTime, tenantId, booking.id);
        }
        Object.assign(booking, updateBookingDto);
        return this.bookingRepository.save(booking);
    }
    async remove(id, tenantId) {
        const booking = await this.findOne(id, tenantId);
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        await this.bookingRepository.save(booking);
    }
    async cancelByToken(token, reason) {
        const booking = await this.bookingRepository.findOne({
            where: { cancelToken: token },
            relations: ['service', 'staff', 'customer'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status === booking_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        if (reason) {
            booking.cancelReason = reason;
        }
        return this.bookingRepository.save(booking);
    }
    async checkAvailability(staffId, startTime, endTime, tenantId, excludeBookingId) {
        const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
            .where('booking.staffId = :staffId', { staffId })
            .andWhere('booking.tenantId = :tenantId', { tenantId })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.PENDING, booking_entity_1.BookingStatus.CONFIRMED]
        })
            .andWhere('(booking.startTime < :endTime AND booking.endTime > :startTime)', { startTime, endTime });
        if (excludeBookingId) {
            queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
        }
        const conflictingBooking = await queryBuilder.getOne();
        if (conflictingBooking) {
            throw new common_1.ConflictException('Time slot is not available');
        }
        return true;
    }
    async getAvailableSlots(serviceId, staffId, date, tenantId) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const bookings = await this.bookingRepository
            .createQueryBuilder('booking')
            .where('booking.staffId = :staffId', { staffId })
            .andWhere('booking.tenantId = :tenantId', { tenantId })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.PENDING, booking_entity_1.BookingStatus.CONFIRMED]
        })
            .andWhere('booking.startTime >= :dayStart', { dayStart })
            .andWhere('booking.startTime < :dayEnd', { dayEnd })
            .getMany();
        const availableSlots = [];
        const businessStart = new Date(date);
        businessStart.setHours(9, 0, 0, 0);
        const businessEnd = new Date(date);
        businessEnd.setHours(17, 0, 0, 0);
        const slotDuration = 30;
        let currentSlot = new Date(businessStart);
        while (currentSlot < businessEnd) {
            const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60000);
            const isAvailable = !bookings.some(booking => (booking.startTime < slotEnd && booking.endTime > currentSlot));
            if (isAvailable) {
                availableSlots.push(currentSlot.toTimeString().slice(0, 5));
            }
            currentSlot = new Date(currentSlot.getTime() + slotDuration * 60000);
        }
        return availableSlots;
    }
    generateUniqueToken() {
        return require('crypto').randomBytes(32).toString('hex');
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map