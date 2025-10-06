import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { ServicesModule } from '../services/services.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ServicesModule, StaffModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}