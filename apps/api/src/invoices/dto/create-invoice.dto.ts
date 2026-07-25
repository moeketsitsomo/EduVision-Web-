import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsObject } from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
  @IsString()
  schoolId: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsObject()
  items?: any;
}
