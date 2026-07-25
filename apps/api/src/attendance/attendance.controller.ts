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
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findAll(
    @CurrentUser('schoolId') schoolId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(schoolId, date);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  create(@CurrentUser('schoolId') schoolId: string, @Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(schoolId, dto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findOne(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.attendanceService.findByIdOrThrow(schoolId, id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  update(
    @CurrentUser('schoolId') schoolId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(schoolId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.attendanceService.remove(schoolId, id);
  }
}
