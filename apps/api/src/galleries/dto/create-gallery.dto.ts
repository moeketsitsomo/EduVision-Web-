import { IsString, IsOptional, IsArray } from 'class-validator';

export class GalleryItemInput {
  @IsString()
  mediaId: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  order?: number;
}

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  items?: GalleryItemInput[];
}
