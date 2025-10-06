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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const tenant_entity_1 = require("../entities/tenant.entity");
let AuthService = class AuthService {
    constructor(userRepository, tenantRepository, jwtService) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.jwtService = jwtService;
    }
    async registerTenant(registerDto) {
        const existingTenant = await this.tenantRepository.findOne({
            where: { subdomain: registerDto.subdomain },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Subdomain already exists');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.adminEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const tenant = this.tenantRepository.create({
            name: registerDto.name,
            subdomain: registerDto.subdomain,
        });
        const savedTenant = await this.tenantRepository.save(tenant);
        const hashedPassword = await bcrypt.hash(registerDto.adminPassword, 10);
        const adminUser = this.userRepository.create({
            email: registerDto.adminEmail,
            password: hashedPassword,
            firstName: registerDto.adminFirstName,
            lastName: registerDto.adminLastName,
            role: user_entity_1.UserRole.TENANT_ADMIN,
            tenantId: savedTenant.id,
        });
        await this.userRepository.save(adminUser);
        return {
            tenant: savedTenant,
            user: {
                id: adminUser.id,
                email: adminUser.email,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                role: adminUser.role,
            },
        };
    }
    async validateUser(email, password, tenantId) {
        const user = await this.userRepository.findOne({
            where: { email, isActive: true },
            relations: ['tenant'],
        });
        if (!user) {
            return null;
        }
        if (tenantId && user.tenantId !== tenantId) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            tenantId: user.tenantId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                tenantId: user.tenantId,
                tenant: user.tenant,
            },
        };
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: { id: payload.sub, isActive: true },
                relations: ['tenant'],
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map