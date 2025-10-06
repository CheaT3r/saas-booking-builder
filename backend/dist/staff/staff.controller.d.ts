import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(createStaffDto: CreateStaffDto, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<import("../entities/staff.entity").Staff[]>;
    findOne(id: string, tenantId: string): Promise<import("../entities/staff.entity").Staff>;
    findByService(serviceId: string, tenantId: string): Promise<import("../entities/staff.entity").Staff[]>;
    update(id: string, updateStaffDto: UpdateStaffDto, tenantId: string): Promise<import("../entities/staff.entity").Staff>;
    remove(id: string, tenantId: string): Promise<void>;
}
