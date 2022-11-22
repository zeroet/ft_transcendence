import { Inject, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { IUserService } from 'src/users/services/user/user.interface';
import { toFileStream } from 'qrcode';
import { UserDto } from 'src/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('USER_SERVICE') private userService: IUserService,
  ) {}

  async generateTwoFactorSecret(user: UserDto) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.email,
      process.env.APP_NAME,
      secret,
    );
    await this.userService.setTwoFactorSecret(secret, user.id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return await toFileStream(stream, otpAuthUrl);
  }

  validateTwoFactorCode(two_factor_code: string, user: UserDto) {
    return authenticator.verify({
      token: two_factor_code,
      secret: user.two_factor_secret,
    });
  }

  async setTwoFactorActivated(id: number, two_factor_activated: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.save({ ...user, two_factor_activated });
    }
  }
}
