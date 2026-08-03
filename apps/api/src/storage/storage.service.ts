import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface StoredFile {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class StorageService {
  private s3: S3Client | null = null;

  constructor(private readonly config: ConfigService) {
    if (this.storageType === 's3') {
      const endpoint = this.config.get('S3_ENDPOINT');
      const region = this.config.get('AWS_REGION') || 'us-east-1';
      this.s3 = new S3Client({
        region,
        endpoint: endpoint || undefined,
        forcePathStyle: !!endpoint,
        credentials: {
          accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') || '',
          secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') || '',
        },
      });
    }
  }

  get storageType(): 'local' | 's3' {
    return (this.config.get('STORAGE_TYPE') as any) || 'local';
  }

  get baseUrl(): string {
    return this.config.get('STORAGE_BASE_URL') ?? this.config.get('API_URL') ?? '';
  }

  get root(): string {
    return this.config.get('STORAGE_LOCAL_ROOT') || 'uploads';
  }

  get bucket(): string {
    return this.config.get('AWS_S3_BUCKET') || '';
  }

  async save(file: Express.Multer.File, schoolId: string, folder = 'files'): Promise<StoredFile> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }
    this.validate(file);

    const optimized = await this.optimizeImage(file.buffer, file.mimetype);
    const uploadBuffer = optimized?.buffer ?? file.buffer;
    const mimeType = optimized?.mimeType ?? file.mimetype;
    const size = uploadBuffer.length;

    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    const key = `uploads/${schoolId}/${folder}/${safeName}`;

    if (this.storageType === 's3') {
      if (!this.s3 || !this.bucket) {
        throw new InternalServerErrorException('S3 storage is not configured');
      }
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: uploadBuffer,
          ContentType: mimeType,
          ContentLength: size,
        }),
      );
    } else {
      const dir = path.resolve(this.root, schoolId, folder);
      await fs.mkdir(dir, { recursive: true });
      const filePath = path.join(dir, safeName);
      await fs.writeFile(filePath, uploadBuffer);
    }

    const url = `${this.baseUrl}/${key}`;
    return {
      url,
      filename: safeName,
      originalName: file.originalname,
      mimeType,
      size,
    };
  }

  private async optimizeImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{ buffer: Buffer; mimeType: string } | null> {
    if (!mimeType.startsWith('image/')) return null;
    // Skip vector/animated formats where sharp is not appropriate.
    if (mimeType.includes('svg') || mimeType.includes('gif') || mimeType.includes('x-icon')) return null;

    try {
      const transformer = sharp(buffer).resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      });

      let outputBuffer: Buffer;
      let outputMime = mimeType;
      if (mimeType === 'image/png') {
        outputBuffer = await transformer.png({ quality: 85, compressionLevel: 9 }).toBuffer();
      } else if (mimeType === 'image/webp') {
        outputBuffer = await transformer.webp({ quality: 85 }).toBuffer();
      } else if (mimeType === 'image/avif') {
        outputBuffer = await transformer.avif({ quality: 70 }).toBuffer();
      } else {
        // JPEG and unknown raster formats are normalized to JPEG.
        outputBuffer = await transformer.jpeg({ quality: 85, progressive: true }).toBuffer();
        outputMime = 'image/jpeg';
      }

      // Only replace the file if optimization actually reduced the size.
      if (outputBuffer.length < buffer.length) {
        return { buffer: outputBuffer, mimeType: outputMime };
      }
    } catch (err) {
      // Fall back to the original file if sharp cannot process it.
    }
    return null;
  }

  validate(file: Express.Multer.File): void {
    const maxBytes = parseInt(this.config.get('MAX_UPLOAD_SIZE_MB') || '50', 10) * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(`File too large (max ${maxBytes / 1024 / 1024}MB)`);
    }
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'video/mp4',
      'video/webm',
      'video/mpeg',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/zip',
    ];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }
  }

  async delete(url: string): Promise<void> {
    const key = this.keyFromUrl(url);
    if (!key) return;

    if (this.storageType === 's3') {
      if (this.s3 && this.bucket) {
        await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
      }
    } else {
      const filePath = path.resolve(this.root, key.replace(/^uploads\//, ''));
      try {
        await fs.unlink(filePath);
      } catch {
        // ignore missing files
      }
    }
  }

  async signedUrl(url: string, expiresInSeconds = 3600): Promise<string> {
    if (this.storageType !== 's3' || !this.s3 || !this.bucket) return url;
    const key = this.keyFromUrl(url);
    if (!key) return url;
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  private keyFromUrl(url: string): string | null {
    const base = this.baseUrl;
    if (url.startsWith(base)) {
      return url.slice(base.length + 1);
    }
    const uploads = '/uploads/';
    const idx = url.indexOf(uploads);
    if (idx !== -1) {
      return url.slice(idx + 1);
    }
    return null;
  }
}
