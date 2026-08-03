import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findAll(
    @CurrentUser('schoolId') schoolId: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return this.mediaService.findAll(schoolId, type, category);
  }

  @Get('categories')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  categories(@CurrentUser('schoolId') schoolId: string) {
    return this.mediaService.categories(schoolId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: string,
    @CurrentUser('schoolId') schoolId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.mediaService.upload(file, schoolId, userId, category);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(
    @Param('id') id: string,
    @CurrentUser('schoolId') schoolId: string,
  ) {
    return this.mediaService.remove(schoolId, id);
  }
}
