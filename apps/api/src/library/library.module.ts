import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { BorrowingsController } from './borrowings.controller';

@Module({
  controllers: [LibraryController, BorrowingsController],
  providers: [LibraryService],
})
export class LibraryModule {}
