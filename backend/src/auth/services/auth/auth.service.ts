import { Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Cookies, UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';
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

  hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  async validateUser(userDetails: UserDetails) {
    // console.log('validateUser');
    const { intra_id } = userDetails;
    const user = await this.userRepository.findOneBy({ intra_id });
    // console.log(user);
    if (user) return user;
    return this.createUser(userDetails);
  }

  createUser(userDetails: UserDetails) {
    console.log('creating a new user');
    const user = this.userRepository.create(userDetails);
    return this.userRepository.save(user);
  }

  getAccessToken(id: number) {
    const access = this.jwtService.sign(
      {
        sub: id,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_EXPIRATION_TIME}s`,
      },
    );
    return access;
  }

  getRefreshToken(id: number) {
    const refresh = this.jwtService.sign(
      {
        sub: id,
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

  async updateRefreshTokenHash(id: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    return hash;
  }
}
