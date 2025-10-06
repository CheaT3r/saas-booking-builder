"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../entities/tenant.entity");
let TenantsService = class TenantsService {
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async create(createTenantDto) {
        const existingTenant = await this.tenantRepository.findOne({
            where: { subdomain: createTenantDto.subdomain },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Subdomain already exists');
        }
        const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!subdomainRegex.test(createTenantDto.subdomain)) {
            throw new common_1.ConflictException('Invalid subdomain format');
        }
        const tenant = this.tenantRepository.create({
            name: createTenantDto.name,
            subdomain: createTenantDto.subdomain,
            settings: {
                theme: 'default',
                currency: 'USD',
                timezone: 'UTC',
                businessHours: {
                    monday: { open: '09:00', close: '17:00' },
                    tuesday: { open: '09:00', close: '17:00' },
                    wednesday: { open: '09:00', close: '17:00' },
                    thursday: { open: '09:00', close: '17:00' },
                    friday: { open: '09:00', close: '17:00' },
                    saturday: { open: '09:00', close: '17:00' },
                    sunday: { open: 'closed', close: 'closed' },
                },
            },
        });
        return this.tenantRepository.save(tenant);
    }
    async findBySubdomain(subdomain) {
        return this.tenantRepository.findOne({
            where: { subdomain, isActive: true },
        });
    }
    async findById(id) {
        return this.tenantRepository.findOne({
            where: { id, isActive: true },
        });
    }
    async findAll() {
        return this.tenantRepository.find({
            where: { isActive: true },
        });
    }
    async update(id, updateTenantDto) {
        const tenant = await this.findById(id);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        if (updateTenantDto.subdomain && updateTenantDto.subdomain !== tenant.subdomain) {
            const existingTenant = await this.tenantRepository.findOne({
                where: { subdomain: updateTenantDto.subdomain },
            });
            if (existingTenant) {
                throw new common_1.ConflictException('Subdomain already exists');
            }
        }
        Object.assign(tenant, updateTenantDto);
        return this.tenantRepository.save(tenant);
    }
    async remove(id) {
        const tenant = await this.findById(id);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        tenant.isActive = false;
        await this.tenantRepository.save(tenant);
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map