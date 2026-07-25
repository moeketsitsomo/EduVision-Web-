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
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findAll(
    @CurrentUser('schoolId') schoolId: string,
    @Query('studentNumber') studentNumber?: string,
  ) {
    return this.resultsService.findAll(schoolId, studentNumber);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  create(@CurrentUser('schoolId') schoolId: string, @Body() dto: CreateResultDto) {
    return this.resultsService.create(schoolId, dto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER, UserRole.PARENT, UserRole.LEARNER)
  findOne(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.resultsService.findByIdOrThrow(schoolId, id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.TEACHER)
  update(
    @CurrentUser('schoolId') schoolId: string,
    @Param('id') id: string,
    @Body() dto: UpdateResultDto,
  ) {
    return this.resultsService.update(schoolId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@CurrentUser('schoolId') schoolId: string, @Param('id') id: string) {
    return this.resultsService.remove(schoolId, id);
  }
}
