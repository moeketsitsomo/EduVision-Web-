import { IsString, IsOptional } from 'class-validator';

export class CreateDownloadDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  mediaId?: string;
}
