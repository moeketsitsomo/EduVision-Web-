import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [StorageModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
