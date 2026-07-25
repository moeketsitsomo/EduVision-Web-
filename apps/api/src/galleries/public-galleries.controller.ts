import { Controller, Get, Param } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/galleries')
export class PublicGalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.galleriesService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant('id') schoolId: string) {
    return this.galleriesService.findById(schoolId, id);
  }
}
