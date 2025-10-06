import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantRequest } from '../middleware/tenant.middleware';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    
    if (request.tenantId && (request as any).body) {
      // Add tenantId to the request body for create/update operations
      (request as any).body.tenantId = request.tenantId;
    }

    return next.handle();
  }
}