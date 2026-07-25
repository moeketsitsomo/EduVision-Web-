import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.event.findMany({
      where: { schoolId },
      orderBy: { startAt: 'desc' },
    });
  }

  findUpcoming(schoolId: string) {
    const now = new Date();
    return this.prisma.event.findMany({
      where: { schoolId, isPublished: true, endAt: { gte: now } },
      orderBy: { startAt: 'asc' },
    });
  }

  findPublished(schoolId: string) {
    return this.prisma.event.findMany({
      where: { schoolId, isPublished: true },
      orderBy: { startAt: 'asc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const event = await this.prisma.event.findFirst({ where: { id, schoolId } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  create(schoolId: string, data: any) {
    return this.prisma.event.create({
      data: {
        ...data,
        schoolId,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : null,
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const event = await this.findById(schoolId, id);
    if (data.startAt) data.startAt = new Date(data.startAt);
    if (data.endAt) data.endAt = new Date(data.endAt);
    return this.prisma.event.update({ where: { id: event.id }, data });
  }

  async remove(schoolId: string, id: string) {
    const event = await this.findById(schoolId, id);
    return this.prisma.event.delete({ where: { id: event.id } });
  }
}
