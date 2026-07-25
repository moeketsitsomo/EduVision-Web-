import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PublicContactsController } from './public-contacts.controller';

@Module({
  controllers: [ContactsController, PublicContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
