import { BookingStatus, BookingType } from '../../entities/booking.entity';
export declare class CreateBookingDto {
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone?: string;
    notes?: string;
    price: number;
    depositAmount?: number;
    status?: BookingStatus;
    type?: BookingType;
    startTime: Date;
    endTime: Date;
    serviceId: string;
    staffId: string;
    customerId?: string;
}
