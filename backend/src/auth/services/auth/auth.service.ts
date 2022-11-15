import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
          expiresIn:
            Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) * 1000,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn:
            Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
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
        expiresIn:
          Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) * 1000,
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
        expiresIn:
          Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
      },
    );
    return refresh;
  }

  async updateRefreshTokenHash(id: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
  }
}
