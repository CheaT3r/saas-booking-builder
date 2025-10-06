import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { BookingStatus, BookingType } from '../../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerFirstName: string;

  @IsString()
  @IsNotEmpty()
  customerLastName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  depositAmount?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus = BookingStatus.PENDING;

  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType = BookingType.REGULAR;

  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  serviceId: string;

  @IsNotEmpty()
  staffId: string;

  @IsOptional()
  customerId?: string;
}