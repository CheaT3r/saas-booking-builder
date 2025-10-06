import { User } from './user.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';
import { Booking } from './booking.entity';
export declare class Tenant {
    id: string;
    name: string;
    subdomain: string;
    settings: {
        theme: string;
        currency: string;
        timezone: string;
        businessHours: {
            monday: {
                open: string;
                close: string;
            };
            tuesday: {
                open: string;
                close: string;
            };
            wednesday: {
                open: string;
                close: string;
            };
            thursday: {
                open: string;
                close: string;
            };
            friday: {
                open: string;
                close: string;
            };
            saturday: {
                open: string;
                close: string;
            };
            sunday: {
                open: string;
                close: string;
            };
        };
    };
    isActive: boolean;
    plan: 'trial' | 'basic' | 'premium' | 'enterprise';
    stripeCustomerId: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    services: Service[];
    staff: Staff[];
    bookings: Booking[];
}
