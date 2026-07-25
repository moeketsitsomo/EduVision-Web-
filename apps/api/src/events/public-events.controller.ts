import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('public/events')
export class PublicEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(
    @Tenant('id') schoolId: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return upcoming === 'true'
      ? this.eventsService.findUpcoming(schoolId)
      : this.eventsService.findPublished(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant('id') schoolId: string) {
    return this.eventsService.findById(schoolId, id);
  }
}
