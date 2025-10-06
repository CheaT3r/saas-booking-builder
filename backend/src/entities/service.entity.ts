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

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  duration: number; // in minutes

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  settings: {
    requiresDeposit: boolean;
    depositAmount: number;
    allowOnlineBooking: boolean;
    bufferTime: number; // minutes between appointments
  };

  @ManyToOne(() => Tenant, (tenant) => tenant.services, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}