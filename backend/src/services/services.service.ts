import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { CurrentTenantId } from '../common/decorators/tenant.decorator';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: any, tenantId: string): Promise<any> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      tenantId,
    });

    return this.serviceRepository.save(service);
  }

  async findAll(tenantId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { tenantId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id, tenantId, isActive: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, updateServiceDto: any, tenantId: string): Promise<Service> {
    const service = await this.findOne(id, tenantId);
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const service = await this.findOne(id, tenantId);
    service.isActive = false;
    await this.serviceRepository.save(service);
  }
}