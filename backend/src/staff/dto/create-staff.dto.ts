import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsNotEmpty()
  schedule: {
    monday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    tuesday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    wednesday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    thursday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    friday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    saturday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
    sunday: { available: boolean; startTime: string; endTime: string; breakStart?: string; breakEnd?: string };
  };

  @IsOptional()
  @IsArray()
  services?: string[];

  @IsOptional()
  @IsArray()
  specializations?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(3.0)
  bookingMultiplier?: number = 1.0;
}