import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
export declare class TenantsService {
    private tenantRepository;
    constructor(tenantRepository: Repository<Tenant>);
    create(createTenantDto: {
        name: string;
        subdomain: string;
        adminEmail: string;
        adminPassword: string;
    }): Promise<Tenant>;
    findBySubdomain(subdomain: string): Promise<Tenant | null>;
    findById(id: string): Promise<Tenant | null>;
    findAll(): Promise<Tenant[]>;
    update(id: string, updateTenantDto: Partial<Tenant>): Promise<Tenant>;
    remove(id: string): Promise<void>;
}
