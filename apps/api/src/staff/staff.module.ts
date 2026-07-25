import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { PublicStaffController } from './public-staff.controller';

@Module({
  controllers: [StaffController, PublicStaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
