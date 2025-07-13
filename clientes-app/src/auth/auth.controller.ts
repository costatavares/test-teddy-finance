/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refresh_token') bodyToken: string,
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const refreshToken = bodyToken || authHeader?.replace('Bearer ', '');

    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Refresh token não informado' });
    }

    try {
      const tokens = await this.authService.doRefreshToken(refreshToken);
      return res.status(HttpStatus.OK).json(tokens);
    } catch (error: any) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token inválido ou expirado' });
    }
  }
}
