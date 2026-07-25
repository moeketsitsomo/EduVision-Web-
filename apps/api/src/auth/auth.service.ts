import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
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
    const { passwordHash, ...rest } = user as any;
    return rest;
  }
}
