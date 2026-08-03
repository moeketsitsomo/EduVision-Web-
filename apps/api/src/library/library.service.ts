import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  findAllBooks(schoolId: string) {
    return this.prisma.book.findMany({
      where: { schoolId },
      orderBy: { title: 'asc' },
    });
  }

  async findBookById(schoolId: string, id: string) {
    const book = await this.prisma.book.findFirst({ where: { id, schoolId } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  createBook(schoolId: string, data: any) {
    const total = data.copiesTotal ? Number(data.copiesTotal) : 1;
    const available = data.copiesAvailable != null ? Number(data.copiesAvailable) : total;
    return this.prisma.book.create({
      data: { ...data, copiesTotal: total, copiesAvailable: available, schoolId },
    });
  }

  async updateBook(schoolId: string, id: string, data: any) {
    const book = await this.findBookById(schoolId, id);
    return this.prisma.book.update({ where: { id: book.id }, data });
  }

  async removeBook(schoolId: string, id: string) {
    const book = await this.findBookById(schoolId, id);
    return this.prisma.book.delete({ where: { id: book.id } });
  }

  findAllBorrowings(schoolId: string) {
    return this.prisma.borrowing.findMany({
      where: { schoolId },
      orderBy: { borrowedAt: 'desc' },
      include: { book: { select: { title: true } } },
    });
  }

  async findBorrowingById(schoolId: string, id: string) {
    const borrowing = await this.prisma.borrowing.findFirst({
      where: { id, schoolId },
      include: { book: { select: { title: true } } },
    });
    if (!borrowing) throw new NotFoundException('Borrowing not found');
    return borrowing;
  }

  async createBorrowing(schoolId: string, data: any) {
    const book = await this.findBookById(schoolId, data.bookId);
    if (book.copiesAvailable <= 0) {
      throw new NotFoundException('No copies available');
    }

    const [borrowing] = await this.prisma.$transaction([
      this.prisma.borrowing.create({
        data: {
          ...data,
          schoolId,
          borrowedAt: new Date(data.borrowedAt || Date.now()),
          dueDate: new Date(data.dueDate),
          returnedAt: data.returnedAt ? new Date(data.returnedAt) : null,
        },
      }),
      this.prisma.book.update({
        where: { id: book.id },
        data: { copiesAvailable: { decrement: 1 } },
      }),
    ]);

    return borrowing;
  }

  async updateBorrowing(schoolId: string, id: string, data: any) {
    const borrowing = await this.findBorrowingById(schoolId, id);
    const returnedAt = data.returnedAt ? new Date(data.returnedAt) : null;

    if (!borrowing.returnedAt && returnedAt) {
      await this.prisma.book.update({
        where: { id: borrowing.bookId },
        data: { copiesAvailable: { increment: 1 } },
      });
    }

    return this.prisma.borrowing.update({
      where: { id: borrowing.id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : borrowing.dueDate,
        returnedAt,
      },
    });
  }

  async removeBorrowing(schoolId: string, id: string) {
    const borrowing = await this.findBorrowingById(schoolId, id);
    if (!borrowing.returnedAt) {
      await this.prisma.book.update({
        where: { id: borrowing.bookId },
        data: { copiesAvailable: { increment: 1 } },
      });
    }
    return this.prisma.borrowing.delete({ where: { id: borrowing.id } });
  }
}
