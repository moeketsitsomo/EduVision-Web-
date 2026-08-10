import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { SetupController } from './setup.controller';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [SetupController],
})
export class SetupModule {}
