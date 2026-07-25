import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { VerifyTotpDto } from './dto/totp.dto';
import { User, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  schoolId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(dto: LoginDto, req: any, res: Response) {
    let tenant = null;
    if (dto.schoolSlug) {
      tenant = await this.tenantService.resolveBySlug(dto.schoolSlug);
    }
    if (!tenant) {
      tenant = await this.tenantService.resolveFromRequest(req);
    }
    if (!tenant) {
      throw new BadRequestException('School tenant not found. Provide a valid schoolSlug or use a school subdomain.');
    }

    const user = await this.usersService.findByEmailAndSchool(dto.email, tenant.id);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    if (user.twoFactorEnabled) {
      if (!dto.totpCode) {
        return {
          requiresTwoFactor: true,
          userId: user.id,
          message: 'Two-factor authentication code required',
        };
      }
      const verified = await this.verifyTotp(user.id, dto.totpCode);
      if (!verified) {
        throw new UnauthorizedException('Invalid two-factor authentication code');
      }
    }

    this.ensureSubscription(tenant);

    await this.usersService.updateLastLogin(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
    });

    const isProd = this.config.get('NODE_ENV') === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: this.config.get('COOKIE_DOMAIN') || undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto, req: any) {
    let tenant = null;
    if (dto.schoolSlug) {
      tenant = await this.tenantService.resolveBySlug(dto.schoolSlug);
    }
    if (!tenant) {
      tenant = await this.tenantService.resolveFromRequest(req);
    }
    if (!tenant) {
      throw new BadRequestException('School tenant not found.');
    }

    const user = await this.usersService.findByEmailAndSchool(dto.email, tenant.id);
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await this.prisma.passwordResetToken.create({
        data: {
          email: dto.email.toLowerCase(),
          tokenHash,
          schoolId: tenant.id,
          expiresAt,
        },
      });

      const baseUrl = this.config.get('API_URL') || `https://${req.headers.host}`;
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&schoolSlug=${tenant.slug}`;
      await this.emailService.sendPasswordReset(dto.email, resetUrl, tenant.name || tenant.slug);
    }

    return { message: 'If an account exists, a reset email has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.usersService.findByEmailAndSchool(resetToken.email, resetToken.schoolId || '');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Password updated successfully' };
  }

  async setupTotp(userId: string) {
    const user = await this.usersService.findByIdOrThrow(userId);
    if (user.twoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication is already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `EduVision (${user.email})`,
      issuer: 'EduVision',
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: this.encrypt(secret.base32) },
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      qrCode,
    };
  }

  async enableTotp(userId: string, dto: VerifyTotpDto) {
    const user = await this.usersService.findByIdOrThrow(userId);
    if (!user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication setup not started');
    }

    const verified = speakeasy.totp.verify({
      secret: this.decrypt(user.twoFactorSecret),
      encoding: 'base32',
      token: dto.code,
      window: 2,
    });

    if (!verified) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { message: 'Two-factor authentication enabled' };
  }

  async disableTotp(userId: string, dto: { password: string }) {
    const user = await this.usersService.findByIdOrThrow(userId);
    if (!user.twoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }
    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: null },
    });

    return { message: 'Two-factor authentication disabled' };
  }

  async verifyTotp(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) return false;
    return speakeasy.totp.verify({
      secret: this.decrypt(user.twoFactorSecret),
      encoding: 'base32',
      token: code,
      window: 2,
    });
  }

  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: this.config.get('NODE_ENV') === 'production' ? 'none' : 'lax',
      domain: this.config.get('COOKIE_DOMAIN') || undefined,
    });
    return { message: 'Logged out successfully' };
  }

  me(user: any) {
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    const { passwordHash, twoFactorSecret, ...rest } = user as any;
    return rest;
  }

  private ensureSubscription(school: any) {
    if (!school) return;
    if (school.subscriptionStatus === 'SUSPENDED' || school.subscriptionStatus === 'CANCELLED' || school.subscriptionStatus === 'EXPIRED') {
      throw new UnauthorizedException('School subscription is not active. Please contact support.');
    }
  }

  private encrypt(value: string): string {
    const key = this.config.get('TOTP_SECRET') || this.config.get('JWT_SECRET') || 'default-encryption-key-32-characters';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.deriveKey(key), iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(value: string): string {
    const key = this.config.get('TOTP_SECRET') || this.config.get('JWT_SECRET') || 'default-encryption-key-32-characters';
    const parts = value.split(':');
    if (parts.length !== 2) return value;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.deriveKey(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private deriveKey(secret: string): Buffer {
    return crypto.createHash('sha256').update(secret).digest();
  }
}
