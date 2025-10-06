import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
export declare class BookingsService {
    private bookingRepository;
    constructor(bookingRepository: Repository<Booking>);
    create(createBookingDto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        staffId?: string;
        serviceId?: string;
        status?: BookingStatus;
    }): Promise<Booking[]>;
    findOne(id: string, tenantId: string): Promise<Booking>;
    update(id: string, updateBookingDto: any, tenantId: string): Promise<Booking>;
    remove(id: string, tenantId: string): Promise<void>;
    cancelByToken(token: string, reason?: string): Promise<Booking>;
    checkAvailability(staffId: string, startTime: Date, endTime: Date, tenantId: string, excludeBookingId?: string): Promise<boolean>;
    getAvailableSlots(serviceId: string, staffId: string, date: Date, tenantId: string): Promise<string[]>;
    private generateUniqueToken;
}
