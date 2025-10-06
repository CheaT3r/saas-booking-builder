import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<import("../entities/service.entity").Service[]>;
    findOne(id: string, tenantId: string): Promise<import("../entities/service.entity").Service>;
    update(id: string, updateServiceDto: UpdateServiceDto, tenantId: string): Promise<import("../entities/service.entity").Service>;
    remove(id: string, tenantId: string): Promise<void>;
}
