import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';
import { Booking } from './booking.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column('jsonb', { nullable: true })
  settings: {
    theme: string;
    currency: string;
    timezone: string;
    businessHours: {
      monday: { open: string; close: string };
      tuesday: { open: string; close: string };
      wednesday: { open: string; close: string };
      thursday: { open: string; close: string };
      friday: { open: string; close: string };
      saturday: { open: string; close: string };
      sunday: { open: string; close: string };
    };
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'trial' })
  plan: 'trial' | 'basic' | 'premium' | 'enterprise';

  @Column({ nullable: true })
  stripeCustomerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Service, (service) => service.tenant)
  services: Service[];

  @OneToMany(() => Staff, (staff) => staff.tenant)
  staff: Staff[];

  @OneToMany(() => Booking, (booking) => booking.tenant)
  bookings: Booking[];
}