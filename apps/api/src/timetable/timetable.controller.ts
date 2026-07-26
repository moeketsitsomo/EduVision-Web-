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
import { TimetableService } from './timetable.service';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto';
import { UpdateTimetableEntryDto } from './dto/update-timetable-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  findAll(@CurrentUser('schoolId') schoolId: string) {
    return this.timetableService.findAll(schoolId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  create(
    @Body() dto: CreateTimetableEntryDto,
    @CurrentUser('schoolId') schoolId: string,
  ) {
    return this.timetableService.create(schoolId, dto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  findOne(@Param('id') id: string, @CurrentUser('schoolId') schoolId: string) {
    return this.timetableService.findById(schoolId, id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTimetableEntryDto,
    @CurrentUser('schoolId') schoolId: string,
  ) {
    return this.timetableService.update(schoolId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@Param('id') id: string, @CurrentUser('schoolId') schoolId: string) {
    return this.timetableService.remove(schoolId, id);
  }
}
