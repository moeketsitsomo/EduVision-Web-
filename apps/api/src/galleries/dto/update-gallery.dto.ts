import { IsString, IsOptional, IsArray } from 'class-validator';
import { GalleryItemInput } from './create-gallery.dto';

export class UpdateGalleryDto {
  @IsOptional()
  @IsString()
  title?: string;

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
