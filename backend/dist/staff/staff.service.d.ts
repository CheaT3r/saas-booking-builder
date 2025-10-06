import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
export declare class StaffService {
    private staffRepository;
    constructor(staffRepository: Repository<Staff>);
    create(createStaffDto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<Staff[]>;
    findOne(id: string, tenantId: string): Promise<Staff>;
    update(id: string, updateStaffDto: any, tenantId: string): Promise<Staff>;
    remove(id: string, tenantId: string): Promise<void>;
    findByService(serviceId: string, tenantId: string): Promise<Staff[]>;
}
