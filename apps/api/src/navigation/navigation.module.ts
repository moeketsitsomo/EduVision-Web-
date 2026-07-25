import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { PublicNavigationController } from './public-navigation.controller';

@Module({
  controllers: [NavigationController, PublicNavigationController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
