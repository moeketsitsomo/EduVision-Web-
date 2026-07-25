import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/contacts')
export class PublicContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.contactsService.findAll(schoolId);
  }
}
