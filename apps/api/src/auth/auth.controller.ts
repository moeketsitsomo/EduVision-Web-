import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { VerifyTotpDto } from './dto/totp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, req, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return this.authService.me(user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: RequestPasswordResetDto, @Req() req: any) {
    return this.authService.requestPasswordReset(dto, req);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Query() query: any) {
    if (query.token && !dto.token) {
      dto.token = query.token;
    }
    return this.authService.resetPassword(dto);
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  async setupTwoFactor(@CurrentUser() user: any) {
    return this.authService.setupTotp(user.id);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enableTwoFactor(@CurrentUser() user: any, @Body() dto: VerifyTotpDto) {
    return this.authService.enableTotp(user.id, dto);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disableTwoFactor(@CurrentUser() user: any, @Body() dto: { password: string }) {
    return this.authService.disableTotp(user.id, dto);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactor(@CurrentUser() user: any, @Body() dto: VerifyTotpDto) {
    return this.authService.verifyTotp(user.id, dto.code);
  }
}
