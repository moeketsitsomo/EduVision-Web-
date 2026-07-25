import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  number: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
