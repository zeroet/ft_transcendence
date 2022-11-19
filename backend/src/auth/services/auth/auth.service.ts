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

  async getTokens(id: number) {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: `${process.env.JWT_ACCESS_EXPIRATION_TIME}`,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: `${process.env.JWT_REFRESH_EXPIRATION_TIME}`,
        },
      ),
    ]);
    return { access_token: access, refresh_token: refresh };
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

  // setAccessToken(@Response() res, id: number) {
  //   res.cookie(
  //     Cookies.ACCESS_TOKEN,
  //     this.getAccessToken(id),
  //     this.accessTokenCookieOptions,
  //   );
  // }

  // setRefreshToken(@Response() res, id: number) {
  //   res.cookie(
  //     Cookies.REFRESH_TOKEN,
  //     this.getRefreshToken(id),
  //     this.refreshTokenCookieOptions,
  //   );
  // }

  async updateRefreshTokenHash(id: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
  }
}
