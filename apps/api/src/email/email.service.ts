import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get('EMAIL_HOST');
    const port = parseInt(this.config.get('EMAIL_PORT') || '587', 10);
    const user = this.config.get('EMAIL_USER');
    const pass = this.config.get('EMAIL_PASS');
    const secure = this.config.get('EMAIL_SECURE') === 'true' || port === 465;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    } else {
      this.logger.warn('Email not configured. Password reset and notification emails will be logged to console.');
    }
  }

  async sendPasswordReset(email: string, resetUrl: string, schoolName: string) {
    const subject = `Reset your ${schoolName} password`;
    const text = `Click the link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`;
    const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password for ${schoolName}.</p><p>This link expires in 1 hour.</p>`;
    return this.send({ to: email, subject, text, html });
  }

  async send({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
    const from = this.config.get('EMAIL_FROM') || 'noreply@eduvision.local';

    if (!this.transporter) {
      this.logger.log(`[Email not sent - no transporter] To: ${to}, Subject: ${subject}`);
      return { message: 'Email not configured' };
    }

    try {
      const result = await this.transporter.sendMail({ from, to, subject, text, html });
      this.logger.log(`Email sent to ${to}: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.transporter;
  }
}
