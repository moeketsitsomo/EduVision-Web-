import { Controller, Get, Param, Query } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/downloads')
export class PublicDownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get()
  findAll(
    @Tenant('id') schoolId: string,
    @Query('category') category?: string,
  ) {
    const result = this.downloadsService.findPublished(schoolId);
    return category ? result.then((items) => items.filter((d: any) => d.category === category)) : result;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant('id') schoolId: string) {
    return this.downloadsService.findById(schoolId, id);
  }
}
