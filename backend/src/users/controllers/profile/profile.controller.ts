import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Inject,
  BadRequestException,
  UnauthorizedException,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { ProfileService } from 'src/users/services/profile/profile.service';
import { profileDTO } from '../../dto/profile.dto';

@ApiTags('SETTING')
@Controller('setting')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('username')
  async changeUsername(@Request() req, @Body() newUserName: profileDTO) {
    // if (newUserName.username.length > 30) throw new BadRequestException('Username is tool long (max 30)');
    console.log('post username in ');
    console.log(newUserName);
    await this.profileService.updateUserName(req.user.id, newUserName.username);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Post('userimage')
  async changeUserImage(@Request() req, @Body() newUserImage: profileDTO) {
    await this.profileService.updateUserImage(
      req.user.id,
      newUserImage.image_url,
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('otp')
  async getOtp(@Request() req): Promise<IUser> {
    return await this.profileService.getOtp(req.user.id);
  }
  // @UseGuards(JwtAccessAuthGuard)
  // @Post('setOtp')
  // async setOtp(@Request() req, @Body() { set, two_factor_code }) {
  //   const isCodeValid = this.profileService.validateTwoFactorCode(
  //     two_factor_code,
  //     req.user,
  //   );
  //   if (!isCodeValid) {
  //     throw new UnauthorizedException('Invalid authentication code');
  //   }
  //   await this.profileService.setOtp(req.user.id, set);
  // }

  // @UseGuards(JwtAccessAuthGuard)
  // @Get('generate')
  // async register(@Req() req, @Res() res: Response) {
  //   console.log('generate');
  //   const { otpAuthUrl } = await this.profileService.generateTwoFactorSecret(
  //     req.user,
  //   );
  //   return this.profileService.pipeQrCodeStream(res, otpAuthUrl);
  // }
}
