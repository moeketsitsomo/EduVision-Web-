import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  copiesTotal?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  copiesAvailable?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  publishedYear?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
