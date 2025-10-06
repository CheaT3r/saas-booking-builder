import { AuthService } from './auth.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerTenant(registerDto: RegisterTenantDto): Promise<{
        tenant: import("../entities/tenant.entity").Tenant;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../entities/user.entity").UserRole;
        };
    }>;
    login(req: any, loginDto: LoginDto): Promise<{
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
    getProfile(req: any): Promise<any>;
}
