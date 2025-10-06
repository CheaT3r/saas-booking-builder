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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenantId } from '../common/decorators/tenant.decorator';
import { BookingStatus } from '../entities/booking.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentTenantId() tenantId: string) {
    return this.bookingsService.create(createBookingDto, tenantId);
  }

  @Get()
  findAll(
    @CurrentTenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('staffId') staffId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('status') status?: BookingStatus,
  ) {
    const filters = {
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(staffId && { staffId }),
      ...(serviceId && { serviceId }),
      ...(status && { status }),
    };

    return this.bookingsService.findAll(tenantId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.bookingsService.findOne(id, tenantId);
  }

  @Get('available-slots/:serviceId/:staffId/:date')
  getAvailableSlots(
    @Param('serviceId') serviceId: string,
    @Param('staffId') staffId: string,
    @Param('date') date: string,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.bookingsService.getAvailableSlots(
      serviceId,
      staffId,
      new Date(date),
      tenantId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.bookingsService.update(id, updateBookingDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.bookingsService.remove(id, tenantId);
  }

  @Post('cancel/:token')
  cancelByToken(
    @Param('token') token: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.cancelByToken(token, reason);
  }
}