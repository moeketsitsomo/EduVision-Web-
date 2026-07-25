import { Controller, Get } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/navigation')
export class PublicNavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.navigationService.findVisible(schoolId);
  }
}
