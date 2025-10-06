import { Tenant } from './tenant.entity';
import { Booking } from './booking.entity';
export declare class Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
    settings: {
        requiresDeposit: boolean;
        depositAmount: number;
        allowOnlineBooking: boolean;
        bufferTime: number;
    };
    tenant: Tenant;
    tenantId: string;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
