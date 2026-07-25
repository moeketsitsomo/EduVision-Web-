import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.schoolsService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() dto: CreateSchoolDto) {
    const { adminEmail, adminPassword, adminFirstName, adminLastName, ...schoolData } = dto;
    const school = await this.schoolsService.create(schoolData);

    if (adminEmail && adminPassword) {
      await this.usersService.create({
        email: adminEmail,
        password: adminPassword,
        firstName: adminFirstName || 'School',
        lastName: adminLastName || 'Admin',
        role: UserRole.SCHOOL_ADMIN,
        schoolId: school.id,
      });
    }

    return school;
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    this.ensureAccess(user, id);
    return this.schoolsService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSchoolDto,
    @CurrentUser() user: any,
  ) {
    this.ensureAccess(user, id);
    return this.schoolsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }

  @Post(':id/suspend')
  @Roles(UserRole.SUPER_ADMIN)
  suspend(@Param('id') id: string) {
    return this.schoolsService.setActive(id, false);
  }

  @Post(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  activate(@Param('id') id: string) {
    return this.schoolsService.setActive(id, true);
  }

  private ensureAccess(user: any, schoolId: string) {
    if (user.role === UserRole.SUPER_ADMIN) return;
    if (user.schoolId !== schoolId) {
      throw new BadRequestException('You do not have access to this school');
    }
  }
}
