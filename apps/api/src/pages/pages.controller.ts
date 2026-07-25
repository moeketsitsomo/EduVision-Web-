import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('pages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findAll(@CurrentUser('schoolId') schoolId: string) {
    return this.pagesService.findAll(schoolId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  create(@Body() dto: CreatePageDto, @CurrentUser('schoolId') schoolId: string) {
    return this.pagesService.create(schoolId, {
      ...dto,
      slug: dto.slug.toLowerCase(),
    });
  }

  @Get(':slug')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findOne(@Param('slug') slug: string, @CurrentUser('schoolId') schoolId: string) {
    return this.pagesService.findBySlug(schoolId, slug.toLowerCase());
  }

  @Patch(':slug')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  update(
    @Param('slug') slug: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser('schoolId') schoolId: string,
  ) {
    return this.pagesService.update(schoolId, slug.toLowerCase(), dto);
  }

  @Delete(':slug')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@Param('slug') slug: string, @CurrentUser('schoolId') schoolId: string) {
    return this.pagesService.remove(schoolId, slug.toLowerCase());
  }
}
