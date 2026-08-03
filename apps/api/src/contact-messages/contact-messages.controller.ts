import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('contact-messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactMessagesController {
  constructor(private readonly service: ContactMessagesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findAll(@CurrentUser('schoolId') schoolId: string) {
    return this.service.findAll(schoolId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  findOne(@Param('id') id: string, @CurrentUser('schoolId') schoolId: string) {
    return this.service.findById(schoolId, id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  create(@Body() dto: CreateContactMessageDto, @CurrentUser('schoolId') schoolId: string) {
    return this.service.create(schoolId, dto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageDto,
    @CurrentUser('schoolId') schoolId: string,
  ) {
    return this.service.update(schoolId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  remove(@Param('id') id: string, @CurrentUser('schoolId') schoolId: string) {
    return this.service.remove(schoolId, id);
  }
}
