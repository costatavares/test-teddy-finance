/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  NotFoundError,
} from './errors';
import { VerifyAccessTokenRespDto } from './dto/verify-access-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepo.findOne({
      where: { email: loginAuthDto.email },
    });
    if (!user || !user.comparePassword(loginAuthDto.password)) {
      throw new InvalidCredentialsError();
    }
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  static generateAccessToken(user: User): string {
    return jwt.sign(
      { name: user.nome, email: user.email },
      process.env.JWT_PRIVATE_KEY as string,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as any,
        subject: user.id + '',
        algorithm: 'RS256',
      },
    );
  }

  static generateRefreshToken(user: User): string {
    return jwt.sign(
      { name: user.nome, email: user.email },
      process.env.JWT_PRIVATE_KEY as string,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as any,
        subject: user.id + '',
        algorithm: 'RS256',
      },
    );
  }

  verifyAccessToken(token: string): VerifyAccessTokenRespDto {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY as string, {
      algorithms: ['RS256'],
    }) as VerifyAccessTokenRespDto;
  }

  static verifyRefreshToken(token: string): VerifyAccessTokenRespDto {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY as string, {
      algorithms: ['RS256'],
    }) as VerifyAccessTokenRespDto;
  }

  async doRefreshToken(refreshToken: string) {
    try {
      const payload = AuthService.verifyRefreshToken(refreshToken);
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundError({ message: 'User not found' });
      }
      const newAccessToken = AuthService.generateAccessToken(user);
      const newRefreshToken = AuthService.generateRefreshToken(user);
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new InvalidRefreshTokenError({ options: { cause: e } });
    }
  }
}
