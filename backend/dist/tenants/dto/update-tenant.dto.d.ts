import { CreateTenantDto } from './create-tenant.dto';
declare const UpdateTenantDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTenantDto>>;
export declare class UpdateTenantDto extends UpdateTenantDto_base {
    name?: string;
    subdomain?: string;
    plan?: 'trial' | 'basic' | 'premium' | 'enterprise';
    stripeCustomerId?: string;
}
export {};
