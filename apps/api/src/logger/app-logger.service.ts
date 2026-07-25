import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private readonly winston: winston.Logger;

  constructor(private readonly config: ConfigService) {
    super();
    const isProd = this.config.get('NODE_ENV') === 'production';
    const level = isProd ? 'info' : 'debug';
    const logDir = this.config.get('LOG_DIR') || 'logs';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          }),
        ),
      }),
    ];

    if (isProd) {
      transports.push(
        new winston.transports.File({
          filename: `${logDir}/error.log`,
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
        new winston.transports.File({
          filename: `${logDir}/combined.log`,
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      );
    }

    this.winston = winston.createLogger({
      level,
      defaultMeta: { service: 'eduvision-api' },
      transports,
    });
  }

  protected printMessages(messages: unknown[], context?: string, logLevel?: LogLevel, writeStreamType?: 'stdout' | 'stderr') {
    for (const message of messages) {
      const text = typeof message === 'string' ? message : JSON.stringify(message);
      this.winston.log({
        level: logLevel || 'info',
        message: text,
        context,
      });
    }
    super.printMessages(messages, context, logLevel, writeStreamType);
  }
}
