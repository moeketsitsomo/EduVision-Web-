import { IsString, IsOptional } from 'class-validator';

export class CreateCommunicationDto {
  @IsString()
  type: string;

  @IsString()
  audience: string;

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  status?: string;
}
