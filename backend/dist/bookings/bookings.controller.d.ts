import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '../entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, tenantId: string): Promise<any>;
    findAll(tenantId: string, startDate?: string, endDate?: string, staffId?: string, serviceId?: string, status?: BookingStatus): Promise<import("../entities/booking.entity").Booking[]>;
    findOne(id: string, tenantId: string): Promise<import("../entities/booking.entity").Booking>;
    getAvailableSlots(serviceId: string, staffId: string, date: string, tenantId: string): Promise<string[]>;
    update(id: string, updateBookingDto: UpdateBookingDto, tenantId: string): Promise<import("../entities/booking.entity").Booking>;
    remove(id: string, tenantId: string): Promise<void>;
    cancelByToken(token: string, reason?: string): Promise<import("../entities/booking.entity").Booking>;
}
