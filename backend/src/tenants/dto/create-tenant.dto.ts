import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
    message: 'Subdomain must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen',
  })
  subdomain: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  adminPassword: string;
}