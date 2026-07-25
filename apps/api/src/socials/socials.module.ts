import { Module } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsController } from './socials.controller';
import { PublicSocialsController } from './public-socials.controller';

@Module({
  controllers: [SocialsController, PublicSocialsController],
  providers: [SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
