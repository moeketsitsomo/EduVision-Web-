import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeeDto {
  @IsString()
  grade: string;

  @IsString()
  item: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  year: string;

  @IsOptional()
  @IsString()
  description?: string;
}
