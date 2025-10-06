import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';
import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
    message: 'Subdomain must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen',
  })
  subdomain?: string;

  @IsOptional()
  @IsString()
  plan?: 'trial' | 'basic' | 'premium' | 'enterprise';

  @IsOptional()
  @IsString()
  stripeCustomerId?: string;
}