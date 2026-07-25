import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  schoolId: string;
  studentId?: string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
  studentId?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailAndSchool(email: string, schoolId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), schoolId },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByIdWithSecret(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }

  async findAll(schoolId: string): Promise<Partial<User>[]> {
    return this.prisma.user.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        schoolId: true,
        studentId: true,
      },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    const existing = await this.findByEmailAndSchool(data.email, data.schoolId);
    if (existing) {
      throw new ConflictException('A user with this email already exists in this school');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        schoolId: data.schoolId,
        studentId: data.studentId,
      },
    });
  }

  async update(id: string, data: UpdateUserInput, schoolId: string): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    if (user.schoolId !== schoolId) {
      throw new BadRequestException('User does not belong to this school');
    }
    const { password, ...rest } = data;
    const updateData: Prisma.UserUpdateInput = rest;
    if (password) {
      (updateData as any).passwordHash = await bcrypt.hash(password, 10);
    }
    if ((updateData as any).studentId === '') {
      (updateData as any).studentId = null;
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, schoolId: string): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    if (user.schoolId !== schoolId) {
      throw new BadRequestException('User does not belong to this school');
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
