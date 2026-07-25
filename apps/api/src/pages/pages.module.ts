import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PublicPagesController } from './public-pages.controller';

@Module({
  controllers: [PagesController, PublicPagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
