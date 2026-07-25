import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeesService } from './fees.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/fees')
export class PublicFeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  findAll(
    @Tenant('id') schoolId: string,
    @Query('year') year?: string,
  ) {
    return this.feesService.findAll(schoolId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant('id') schoolId: string) {
    return this.feesService.findById(schoolId, id);
  }
}
