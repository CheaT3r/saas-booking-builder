import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
export declare class AuthService {
    private userRepository;
    private tenantRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, tenantRepository: Repository<Tenant>, jwtService: JwtService);
    registerTenant(registerDto: {
        name: string;
        subdomain: string;
        adminEmail: string;
        adminPassword: string;
        adminFirstName: string;
        adminLastName: string;
    }): Promise<{
        tenant: Tenant;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRole;
        };
    }>;
    validateUser(email: string, password: string, tenantId?: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            tenantId: any;
            tenant: any;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
