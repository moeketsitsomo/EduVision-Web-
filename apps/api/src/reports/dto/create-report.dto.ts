import { IsString, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  filters?: Record<string, unknown>;
}
