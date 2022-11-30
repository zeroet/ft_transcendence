import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
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

  getAccessToken(id: number, two_factor_activated: boolean) {
    // console.log('getAccessToken() two_factor_activated:', two_factor_activated);
    const access = this.jwtService.sign(
      {
        id: id,
        two_factor_activated: two_factor_activated,
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

  async updateRefreshTokenHash(id: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    return hash;
  }

  async verify(accessToken: any) {
    return await this.jwtService.verify(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validateDummy(userDetails: UserDetails) {
    const { intra_id } = userDetails;
    console.log('dummy intra id:', intra_id);
    const user = await this.userRepository.findOneBy({ intra_id });
    console.log('dummyuser:', user);
    if (user) return true;
    else {
      console.log('return false');
      return false;
    }
  }

  async createDummy(userDetails: UserDetails) {
    const user = this.userRepository.create(userDetails);
    return await this.userRepository.save(user);
  }
  async createDummyUser() {
    console.log('createDummyUser()');
    let name = 'dummy';
    // const intra_id = name;
    // const email = name;
    // const image_url = null;
    // const username = name;
    let userDetails = {
      intra_id: name,
      email: name,
      image_url: process.env.DUMMY_URL,
      username: name,
    };
    let user = await this.validateDummy(userDetails);
    while (user) {
      name += 1;
      console.log('name', name);
      // console.log('name+=1', name + 1);
      userDetails = {
        intra_id: name,
        email: name,
        image_url: process.env.DUMMY_URL,
        username: name,
      };
      user = await this.validateDummy(userDetails);
    }
    console.log('userdetails af if:', userDetails);
    return this.createDummy(userDetails);
  }

  async deleteDummyUser(user) {
    let count = user.intra_id.indexOf('dummy');
    console.log('deleteDummyUser:', count);
    if (count === 0) {
      console.log('dummy:', user.intra_id);
      await this.userRepository.delete(user.id);
      return true;
    }
    return false;
  }
}
