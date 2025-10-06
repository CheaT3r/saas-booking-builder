import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
export interface TenantRequest extends Omit<Request, 'get'> {
    tenant?: Tenant;
    tenantId?: string;
    get(name: string): string | undefined;
}
export declare class TenantMiddleware implements NestMiddleware {
    private tenantRepository;
    constructor(tenantRepository: Repository<Tenant>);
    use(req: TenantRequest, res: Response, next: NextFunction): Promise<void>;
}
