import { Tenant } from './tenant.entity';
import { Booking } from './booking.entity';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    TENANT_ADMIN = "TENANT_ADMIN",
    STAFF = "STAFF",
    CUSTOMER = "CUSTOMER"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    tenant: Tenant;
    tenantId: string;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
