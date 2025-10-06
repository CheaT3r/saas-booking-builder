import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '../../entities/booking.entity';
declare const UpdateBookingDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBookingDto>>;
export declare class UpdateBookingDto extends UpdateBookingDto_base {
    status?: BookingStatus;
    cancelReason?: string;
}
export {};
