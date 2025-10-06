import { Tenant } from './tenant.entity';
import { Booking } from './booking.entity';
export declare class Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isActive: boolean;
    schedule: {
        monday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        tuesday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        wednesday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        thursday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        friday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        saturday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
        sunday: {
            available: boolean;
            startTime: string;
            endTime: string;
            breakStart?: string;
            breakEnd?: string;
        };
    };
    services: string[];
    specializations: string[];
    bookingMultiplier: number;
    tenant: Tenant;
    tenantId: string;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
