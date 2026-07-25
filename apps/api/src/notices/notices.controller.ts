import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole, NoticeAudience } from '@prisma/client';

@Controller('notices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findAll(
    @CurrentUser('schoolId') schoolId: string,
    @Query('audience') audience?: NoticeAudience,
  ) {
    return this.noticesService.findAll(schoolId, audience);
  }

  @Get('admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findAdmin(@CurrentUser('schoolId') schoolId: string) {
    return this.noticesService.findAdmin(schoolId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  create(@CurrentUser('schoolId') schoolId: string, @Body() dto: CreateNoticeDto) {
    return this.noticesService.create(schoolId, dto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findOne(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.noticesService.findByIdOrThrow(schoolId, id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  update(
    @CurrentUser('schoolId') schoolId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(schoolId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.noticesService.remove(schoolId, id);
  }
}
