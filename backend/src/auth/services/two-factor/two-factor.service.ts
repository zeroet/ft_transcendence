import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserDto } from 'src/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { ITwoFactorService } from './two-factor.interface';

@Injectable()
export class TwoFactorService implements ITwoFactorService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // @Inject('USER_SERVICE') private userService: IUserService,
  ) {}

  async generateTwoFactorSecret(user: UserDto) {
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

  validateTwoFactorCode(two_factor_secret: string, two_factor_code: string) {
    return authenticator.verify({
      token: two_factor_code,
      secret: two_factor_secret,
    });
  }

  async setTwoFactorActivated(id: number, two_factor_activated: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.save({ ...user, two_factor_activated });
    }
  }

  async setTwoFactorSecret(id: number, secret: string) {
    return await this.userRepository.update(id, { two_factor_secret: secret });
  }

  async setTwoFactorValid(id: number, two_factor_valid: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.save({ ...user, two_factor_valid });
    }
  }
}
