import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const tenant = await this.tenantService.resolveFromRequest(req);
    if (!tenant) {
      throw new ForbiddenException('School tenant not found or inactive.');
    }
    req.tenant = tenant;
    req.school = tenant;
    return true;
  }
}
