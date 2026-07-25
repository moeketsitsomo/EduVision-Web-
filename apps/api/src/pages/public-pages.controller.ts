import { Controller, Get, Param } from '@nestjs/common';
import { PagesService } from './pages.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/pages')
export class PublicPagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.pagesService.findPublished(schoolId);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Tenant('id') schoolId: string) {
    return this.pagesService.findPublishedBySlug(schoolId, slug.toLowerCase());
  }
}
