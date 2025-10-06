import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { ServicesModule } from './services/services.module';
import { StaffModule } from './staff/staff.module';
import { BookingsModule } from './bookings/bookings.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Service } from './entities/service.entity';
import { Staff } from './entities/staff.entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Tenant,
      User,
      Service,
      Staff,
      Booking,
    ]),
    AuthModule,
    TenantsModule,
    ServicesModule,
    StaffModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TenantInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}