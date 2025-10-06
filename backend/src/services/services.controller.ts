import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenantId } from '../common/decorators/tenant.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @CurrentTenantId() tenantId: string) {
    return this.servicesService.create(createServiceDto, tenantId);
  }

  @Get()
  findAll(@CurrentTenantId() tenantId: string) {
    return this.servicesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.servicesService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.servicesService.update(id, updateServiceDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.servicesService.remove(id, tenantId);
  }
}