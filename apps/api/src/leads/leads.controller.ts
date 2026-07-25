import { Body, Controller, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

class CreateLeadDto {
  type: 'demo' | 'contact' | string;
  name: string;
  email: string;
  phone?: string;
  school?: string;
  message?: string;
}

@Controller('leads')
export class LeadsController {
  constructor(private readonly config: ConfigService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    const storageRoot = this.config.get('STORAGE_LOCAL_ROOT') || 'uploads';
    const leadsDir = path.resolve(storageRoot, 'private', 'leads');
    fs.mkdirSync(leadsDir, { recursive: true });
    const file = path.join(leadsDir, `${dto.type || 'general'}.jsonl`);
    const line = JSON.stringify({ ...dto, createdAt: new Date().toISOString() }) + '\n';
    fs.appendFileSync(file, line, 'utf8');
    return { success: true, message: 'Thank you. Our team will contact you shortly.' };
  }
}
