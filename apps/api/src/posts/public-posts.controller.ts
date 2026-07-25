import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/posts')
export class PublicPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Tenant('id') schoolId: string,
    @Query('category') category?: string,
  ) {
    return this.postsService.findPublished(schoolId, category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Tenant('id') schoolId: string) {
    return this.postsService.findPublishedBySlug(schoolId, slug.toLowerCase());
  }
}
