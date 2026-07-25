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
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post('apply')
  apply(@Body() dto: CreateAdmissionDto & { schoolId: string }) {
    return this.admissionsService.create(dto.schoolId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findAll(@CurrentUser('schoolId') schoolId: string) {
    return this.admissionsService.findAll(schoolId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findOne(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.admissionsService.findByIdOrThrow(schoolId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  update(
    @CurrentUser('schoolId') schoolId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionDto,
  ) {
    return this.admissionsService.update(schoolId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.admissionsService.remove(schoolId, id);
  }
}
