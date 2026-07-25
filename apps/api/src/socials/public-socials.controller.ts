import { Controller, Get } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/socials')
export class PublicSocialsController {
  constructor(private readonly socialsService: SocialsService) {}

  @Get()
  findAll(@Tenant('id') schoolId: string) {
    return this.socialsService.findAll(schoolId);
  }
}
