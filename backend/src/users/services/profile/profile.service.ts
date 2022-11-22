import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { UserDto } from 'src/users/dto/user.dto';
import { authenticator } from 'otplib';
import { IUserService } from '../user/user.interface';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { profileDTO } from 'src/users/dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // private readonly mailerService: MailerService,
    @Inject('USER_SERVICE') private userService: IUserService,
  ) {}

  // async generateTwoFactorSecret(user: UserDto) {
  //   const secret = authenticator.generateSecret();

  //   const otpAuthUrl = authenticator.keyuri(user.email, 'Barcodepong', secret);
  //   await this.userService.setTwoFactorSecret(secret, user.id);
  //   return {
  //     secret,
  //     otpAuthUrl,
  //   };
  // }

  // async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
  //   return toFileStream(stream, otpAuthUrl);
  // }

  // async validateTwoFactorCode(twoFactorCode: string, user: UserDto) {
  //   return authenticator.verify({
  //     token: twoFactorCode,
  //     secret: user.two_factor_secret,
  //   });
  // }

  async updateUserName(userID: number, newUserName: string) {
    await this.userRepository.update(userID, {
      username: newUserName,
    });
    const user = this.userRepository.findOneBy({ id: userID });
    console.log('in the username');
    console.log((await user).username);
  }

  async updateUserImage(userID: number, newUserImage: string) {
    await this.userRepository.update(userID, {
      image_url: newUserImage,
    });
  }

  async getOtp(userID: number) {
    const user = await this.userRepository.findOneBy({ id: userID });
    return user;
  }

  // async setOtp(id: number, two_factor_enabled: boolean) {
  //   const user = await this.userRepository.findOneBy({ id });
  //   if (user) {
  //     await this.userRepository.save({ ...user, two_factor_enabled });
  //   }
  // }

  // async sendConfirmedMail(user: UserDto) {
  //   // const randomNumber = Math.round(Math.random() * 100);
  //   const { email, username } = user;
  //   await this.mailerService.sendMail({
  //     to: email,
  //     from: 'barcodepong@barcode.pong',
  //     subject: 'Two Factor Authentication by Barcodepong',
  //     text: `Verification code for two factor authentication`,
  //     template: 'confirmed',
  //     context: {
  //       username,
  //       email,
  //     },
  //   });
  //   return 'success';
  // }

  // async sendConfirmationMail(user: UserDto) {
  //   const { email, username } = user;
  //   await this.mailerService.sendMail({
  //     to: email,
  //     from: 'barcodepong@barcode.pong',
  //     subject: 'Two Factor Authentication by Barcodepong',
  //     text: `Verification code for two factor authentication`,
  //     template: 'confirm',
  //     context: {
  //       username,
  //       code: this.code,
  //     },
  //   });
  //   return 'success';
  // }
}
