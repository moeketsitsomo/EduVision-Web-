import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantService } from './tenant.service';
import { TenantGuard } from './tenant.guard';
import { TenantMiddleware } from './tenant.middleware';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [TenantService, TenantGuard, TenantMiddleware],
  exports: [TenantService, TenantGuard, TenantMiddleware],
})
export class TenantModule {}
