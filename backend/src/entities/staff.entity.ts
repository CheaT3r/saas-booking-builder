import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Booking } from './booking.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb')
  schedule: {
    monday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    tuesday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    wednesday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    thursday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    friday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    saturday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    sunday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
  };

  @Column('jsonb', { nullable: true })
  services: string[]; // Array of service IDs this staff member can perform

  @Column('jsonb', { nullable: true })
  specializations: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 1.0 })
  bookingMultiplier: number; // For services that take longer/shorter with this staff member

  @ManyToOne(() => Tenant, (tenant) => tenant.staff, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @OneToMany(() => Booking, (booking) => booking.staff)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}