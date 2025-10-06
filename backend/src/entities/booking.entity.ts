import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum BookingType {
  REGULAR = 'REGULAR',
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerFirstName: string;

  @Column()
  customerLastName: string;

  @Column()
  customerEmail: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  depositAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.REGULAR,
  })
  type: BookingType;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column('timestamp', { nullable: true })
  confirmedAt: Date;

  @Column('timestamp', { nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  @Column('timestamp', { nullable: true })
  reminderSentAt: Date;

  @Column({ unique: true })
  cancelToken: string;

  @Column({ unique: true })
  rescheduleToken: string;

  // Foreign keys
  @ManyToOne(() => Tenant, (tenant) => tenant.bookings, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => User, (user) => user.bookings, { nullable: true })
  customer: User;

  @Column({ nullable: true })
  customerId: string;

  @ManyToOne(() => Service, (service) => service.bookings, { onDelete: 'CASCADE' })
  service: Service;

  @Column()
  serviceId: string;

  @ManyToOne(() => Staff, (staff) => staff.bookings, { onDelete: 'CASCADE' })
  staff: Staff;

  @Column()
  staffId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}