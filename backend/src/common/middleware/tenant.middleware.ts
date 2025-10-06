import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';

export interface TenantRequest extends Omit<Request, 'get'> {
  tenant?: Tenant;
  tenantId?: string;
  get(name: string): string | undefined;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const hostname = req.get('host') || '';
      const subdomain = hostname.split('.')[0];

      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        const tenant = await this.tenantRepository.findOne({
          where: { subdomain, isActive: true },
        });

        if (tenant) {
          req.tenant = tenant;
          req.tenantId = tenant.id;
        }
      }

      next();
    } catch (error) {
      next();
    }
  }
}