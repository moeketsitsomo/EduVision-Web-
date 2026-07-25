import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  );
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
  });

  const uploadsRoot = path.resolve(config.get('STORAGE_LOCAL_ROOT') || 'uploads');
  app.use('/uploads', express.static(uploadsRoot));

  const tenantService = app.get(TenantService);
  app.use('/public', async (req, res, next) => {
    const tenant = await tenantService.resolveFromRequest(req);
    if (!tenant || !tenant.isActive) {
      return res.status(403).json({ message: 'School tenant not found or inactive.' });
    }
    (req as any).tenant = tenant;
    (req as any).school = tenant;
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      forbidNonWhitelisted: false,
    }),
  );

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  logger.log(`EduVision API running on port ${port}`);
}

bootstrap();
