import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  subdomain: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  adminFirstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  adminLastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  adminPassword: string;
}