import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: {
    name: string;
    subdomain: string;
    adminEmail: string;
    adminPassword: string;
  }): Promise<Tenant> {
    // Check if subdomain already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain },
    });

    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!subdomainRegex.test(createTenantDto.subdomain)) {
      throw new ConflictException('Invalid subdomain format');
    }

    const tenant = this.tenantRepository.create({
      name: createTenantDto.name,
      subdomain: createTenantDto.subdomain,
      settings: {
        theme: 'default',
        currency: 'USD',
        timezone: 'UTC',
        businessHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: 'closed', close: 'closed' },
        },
      },
    });

    return this.tenantRepository.save(tenant);
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: { subdomain, isActive: true },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      where: { isActive: true },
    });
  }

  async update(id: string, updateTenantDto: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (updateTenantDto.subdomain && updateTenantDto.subdomain !== tenant.subdomain) {
      const existingTenant = await this.tenantRepository.findOne({
        where: { subdomain: updateTenantDto.subdomain },
      });

      if (existingTenant) {
        throw new ConflictException('Subdomain already exists');
      }
    }

    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    tenant.isActive = false;
    await this.tenantRepository.save(tenant);
  }
}