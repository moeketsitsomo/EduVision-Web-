import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';
import { AppLogger } from './logger/app-logger.service';
import * as promClient from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const config = app.get(ConfigService);

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
  app.use(compression());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );
  app.use(
    '/auth/login',
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 10,
      message: 'Too many login attempts from this IP, please try again later.',
    }),
  );

  const allowedOrigins = (config.get('CORS_ORIGINS') || '')
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
  });

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url} - ${req.ip}`, 'HTTP');
    next();
  });

  const uploadsRoot = path.resolve(config.get('STORAGE_LOCAL_ROOT') || 'uploads');
  app.use('/uploads', express.static(uploadsRoot));

  const tenantService = app.get(TenantService);
  app.use('/public', async (req, res, next) => {
    const tenant = await tenantService.resolveFromRequest(req);
    if (!tenant || !tenant.isActive) {
      return res.status(403).json({ message: 'School tenant not found or inactive.' });
    }
    const blocked = ['SUSPENDED', 'CANCELLED', 'EXPIRED'];
    if (blocked.includes(tenant.subscriptionStatus) && tenant.slug !== 'platform') {
      return res.status(403).json({ message: 'School subscription is not active. Please contact support.' });
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
  promClient.collectDefaultMetrics();

  httpAdapter.get('/metrics', async (req: any, res: any) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  httpAdapter.get('/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  logger.log(`EduVision API running on port ${port}`);
}

bootstrap();
