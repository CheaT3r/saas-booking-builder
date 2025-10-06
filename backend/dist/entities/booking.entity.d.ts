import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
export declare enum BookingType {
    REGULAR = "REGULAR",
    CONSULTATION = "CONSULTATION",
    FOLLOW_UP = "FOLLOW_UP"
}
export declare class Booking {
    id: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    price: number;
    depositAmount: number;
    status: BookingStatus;
    type: BookingType;
    startTime: Date;
    endTime: Date;
    confirmedAt: Date;
    cancelledAt: Date;
    cancelReason: string;
    reminderSentAt: Date;
    cancelToken: string;
    rescheduleToken: string;
    tenant: Tenant;
    tenantId: string;
    customer: User;
    customerId: string;
    service: Service;
    serviceId: string;
    staff: Staff;
    staffId: string;
    createdAt: Date;
    updatedAt: Date;
}
