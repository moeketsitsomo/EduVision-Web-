import { Controller, Get, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN)
  stats() {
    return this.superAdminService.getStats();
  }

  @Get('activity')
  @Roles(UserRole.SUPER_ADMIN)
  activity() {
    return this.superAdminService.getRecentActivity();
  }

  @Get('storage')
  @Roles(UserRole.SUPER_ADMIN)
  storage() {
    return this.superAdminService.getStorageUsage();
  }

  @Get('backups')
  @Roles(UserRole.SUPER_ADMIN)
  backups() {
    return this.superAdminService.getBackupStatus();
  }
}
