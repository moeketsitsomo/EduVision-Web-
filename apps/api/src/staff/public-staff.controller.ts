import { Controller, Get, Param } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/staff')
export class PublicStaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.staffService.findPublished(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant('id') schoolId: string) {
    return this.staffService.findById(schoolId, id);
  }
}
