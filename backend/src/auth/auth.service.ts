import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  async registerTenant(registerDto: {
    name: string;
    subdomain: string;
    adminEmail: string;
    adminPassword: string;
    adminFirstName: string;
    adminLastName: string;
  }) {
    // Check if subdomain exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: registerDto.subdomain },
    });

    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    // Check if admin email exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create tenant
    const tenant = this.tenantRepository.create({
      name: registerDto.name,
      subdomain: registerDto.subdomain,
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    // Create admin user
    const hashedPassword = await bcrypt.hash(registerDto.adminPassword, 10);
    const adminUser = this.userRepository.create({
      email: registerDto.adminEmail,
      password: hashedPassword,
      firstName: registerDto.adminFirstName,
      lastName: registerDto.adminLastName,
      role: UserRole.TENANT_ADMIN,
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

  async validateUser(email: string, password: string, tenantId?: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['tenant'],
    });

    if (!user) {
      return null;
    }

    // For tenant-specific login, check tenant
    if (tenantId && user.tenantId !== tenantId) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: any) {
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

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
        relations: ['tenant'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}