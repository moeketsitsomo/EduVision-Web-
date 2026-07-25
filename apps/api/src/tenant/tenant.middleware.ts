import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenant = await this.tenantService.resolveFromRequest(req as any);
    if (!tenant || !tenant.isActive) {
      throw new ForbiddenException('School tenant not found or inactive.');
    }
    (req as any).tenant = tenant;
    (req as any).school = tenant;
    next();
  }
}
