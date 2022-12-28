import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { ITwoFactorService } from './two-factor.interface';
import { IUser } from 'src/typeorm/interfaces/IUser';

@Injectable()
export class TwoFactorService implements ITwoFactorService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async generateTwoFactorSecret(user: IUser) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      process.env.APP_NAME,
      secret,
    );
    await this.setTwoFactorSecret(user.id, secret);
    return otpAuthUrl;
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return await toFileStream(stream, otpAuthUrl);
  }

  validateTwoFactorCode(twoFactorSecret: string, twoFactorCode: string) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: twoFactorSecret,
    });
  }

  async setTwoFactorActivated(id: number, twoFactorActivated: boolean) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:id', { id })
      .getOne();
    if (user) {
      user.two_factor_activated = twoFactorActivated;
      return await this.userRepository.save(user);
    }
  }

  async setTwoFactorSecret(id: number, secret: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:id', { id })
      .getOne();
    user.two_factor_secret = secret;
    return await this.userRepository.save(user);
  }

  async setTwoFactorValid(id: number, twoFactorValid: boolean) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:id', { id })
      .getOne();
    if (user) {
      user.two_factor_valid = twoFactorValid;
      return await this.userRepository.save(user);
    }
  }
}
