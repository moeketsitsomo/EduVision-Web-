import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
