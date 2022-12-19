import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IAuthService } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  defaultCookieOptions: CookieOptions = {
    domain: process.env.BASE_DOMAIN,
    httpOnly: true,
    path: '/',
    maxAge: 0,
  };

  refreshTokenCookieOptions: CookieOptions = {
    ...this.defaultCookieOptions,
    maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
  };

  accessTokenCookieOptions: CookieOptions = {
    ...this.defaultCookieOptions,
    maxAge: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) * 1000,
  };

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 12);
  }

  async updateRefreshTokenHash(
    id: number,
    refreshToken: string,
  ): Promise<string> {
    const hash = await this.hashData(refreshToken);
    return hash;
  }

  getAccessToken(id: number, twoFactorActivated: boolean): string {
    const access = this.jwtService.sign(
      {
        id: id,
        two_factor_activated: twoFactorActivated,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_EXPIRATION_TIME}s`,
      },
    );
    return access;
  }

  getRefreshToken(id: number): string {
    const refresh = this.jwtService.sign(
      {
        id: id,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_EXPIRATION_TIME}s`,
      },
    );
    return refresh;
  }

  async setRefreshToken(id: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.update(id, {
        hashed_refresh_token: await this.updateRefreshTokenHash(
          id,
          refreshToken,
        ),
      });
    }
  }

  async verify(accessToken: any) {
    try {
      const decoded = await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return decoded;
    } catch (err) {
      return err;
    }
  }
}
