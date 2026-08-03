import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';

@Injectable()
export class ContactMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.contactMessage.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(schoolId: string, id: string) {
    return this.prisma.contactMessage.findFirst({ where: { id, schoolId } });
  }

  create(schoolId: string, dto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: { ...dto, schoolId },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateContactMessageDto) {
    const existing = await this.findById(schoolId, id);
    if (!existing) throw new NotFoundException('Contact request not found');
    return this.prisma.contactMessage.update({
      where: { id },
      data: dto,
    });
  }

  async remove(schoolId: string, id: string) {
    const existing = await this.findById(schoolId, id);
    if (!existing) throw new NotFoundException('Contact request not found');
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
