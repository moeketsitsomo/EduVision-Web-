import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBorrowingDto {
  @IsString()
  bookId: string;

  @IsString()
  borrowerType: string;

  @IsString()
  borrowerName: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  returnedAt?: string;
}
