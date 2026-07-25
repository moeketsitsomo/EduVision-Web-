import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { PublicFeesController } from './public-fees.controller';

@Module({
  controllers: [FeesController, PublicFeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
