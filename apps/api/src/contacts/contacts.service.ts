import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.emergencyContact.findMany({
      where: { schoolId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const contact = await this.prisma.emergencyContact.findFirst({
      where: { id, schoolId },
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  create(schoolId: string, data: any) {
    return this.prisma.emergencyContact.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const contact = await this.findById(schoolId, id);
    return this.prisma.emergencyContact.update({
      where: { id: contact.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const contact = await this.findById(schoolId, id);
    return this.prisma.emergencyContact.delete({ where: { id: contact.id } });
  }
}
