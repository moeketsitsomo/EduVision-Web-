import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTimetableEntryDto {
  @IsString()
  className: string;

  @IsString()
  subject: string;

  @IsString()
  teacherName: string;

  @IsString()
  dayOfWeek: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;
}
