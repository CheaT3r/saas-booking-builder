"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
const jwt_config_1 = require("./config/jwt.config");
const redis_config_1 = require("./config/redis.config");
const auth_module_1 = require("./auth/auth.module");
const tenants_module_1 = require("./tenants/tenants.module");
const services_module_1 = require("./services/services.module");
const staff_module_1 = require("./staff/staff.module");
const bookings_module_1 = require("./bookings/bookings.module");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const tenant_interceptor_1 = require("./common/interceptors/tenant.interceptor");
const tenant_entity_1 = require("./entities/tenant.entity");
const user_entity_1 = require("./entities/user.entity");
const service_entity_1 = require("./entities/service.entity");
const staff_entity_1 = require("./entities/staff.entity");
const booking_entity_1 = require("./entities/booking.entity");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, jwt_config_1.default, redis_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    ...configService.get('database'),
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                tenant_entity_1.Tenant,
                user_entity_1.User,
                service_entity_1.Service,
                staff_entity_1.Staff,
                booking_entity_1.Booking,
            ]),
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            services_module_1.ServicesModule,
            staff_module_1.StaffModule,
            bookings_module_1.BookingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            tenant_interceptor_1.TenantInterceptor,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map