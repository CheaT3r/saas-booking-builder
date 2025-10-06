import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: any, tenantId: string): Promise<any> {
    const staff = this.staffRepository.create({
      ...createStaffDto,
      tenantId,
    });

    return this.staffRepository.save(staff);
  }

  async findAll(tenantId: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { tenantId, isActive: true },
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id, tenantId, isActive: true },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async update(id: string, updateStaffDto: any, tenantId: string): Promise<Staff> {
    const staff = await this.findOne(id, tenantId);
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const staff = await this.findOne(id, tenantId);
    staff.isActive = false;
    await this.staffRepository.save(staff);
  }

  async findByService(serviceId: string, tenantId: string): Promise<Staff[]> {
    return this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.tenantId = :tenantId', { tenantId })
      .andWhere('staff.isActive = :isActive', { isActive: true })
      .andWhere(':serviceId = ANY(staff.services)', { serviceId })
      .getMany();
  }
}