import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface StoredFile {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  get baseUrl(): string {
    return this.config.get('API_URL') || '';
  }

  get root(): string {
    return this.config.get('STORAGE_LOCAL_ROOT') || 'uploads';
  }

  async save(file: Express.Multer.File, schoolId: string, folder = 'files'): Promise<StoredFile> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }
    this.validate(file);

    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    const dir = path.resolve(this.root, schoolId, folder);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, safeName);
    await fs.writeFile(filePath, file.buffer);

    const url = `${this.baseUrl}/uploads/${schoolId}/${folder}/${safeName}`;
    return {
      url,
      filename: safeName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  validate(file: Express.Multer.File): void {
    const maxBytes = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxBytes) {
      throw new BadRequestException('File too large (max 50MB)');
    }
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }
  }

  async delete(url: string): Promise<void> {
    const uploads = '/uploads/';
    const idx = url.indexOf(uploads);
    if (idx === -1) return;
    const relative = url.slice(idx + uploads.length);
    const filePath = path.resolve(this.root, relative);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // ignore missing files
    }
  }
}
