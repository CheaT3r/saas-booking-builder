import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
export declare class ServicesService {
    private serviceRepository;
    constructor(serviceRepository: Repository<Service>);
    create(createServiceDto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<Service[]>;
    findOne(id: string, tenantId: string): Promise<Service>;
    update(id: string, updateServiceDto: any, tenantId: string): Promise<Service>;
    remove(id: string, tenantId: string): Promise<void>;
}
