import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subscription.findMany({
      include: { school: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findBySchool(schoolId: string) {
    return this.prisma.subscription.findUnique({
      where: { schoolId },
      include: { school: { select: { name: true } } },
    });
  }

  async create(dto: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({ where: { schoolId: dto.schoolId } });
    if (existing) throw new ConflictException('Subscription already exists for this school');
    return this.prisma.subscription.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async update(schoolId: string, dto: UpdateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({ where: { schoolId } });
    if (!existing) throw new NotFoundException('Subscription not found');
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.trialEndsAt) data.trialEndsAt = new Date(dto.trialEndsAt);
    return this.prisma.subscription.update({ where: { schoolId }, data });
  }

  async markExpired(schoolId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { schoolId } });
    if (!sub) return null;
    await this.prisma.subscription.update({
      where: { schoolId },
      data: { status: SubscriptionStatus.EXPIRED },
    });
    return this.prisma.school.update({
      where: { id: schoolId },
      data: { subscriptionStatus: SubscriptionStatus.EXPIRED },
    });
  }
}
