import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  BadRequestException,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { ProfileService } from 'src/users/services/profile/profile.service';
import { profileDTO } from '../../dto/profile.dto';

@Controller('setting')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAccessAuthGuard) // 수정해놨습니다! 유저찍어보면 username이 수정되있네요
  // 저거 원래 1 대신에 @Request() req.user.id 해서 들어가야하는데 그렇게 하면 access어쩌고 에러뜸 ㅠ
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
  @UseGuards(JwtAccessAuthGuard)
  @Post('setOtp')
  async setOtp(@Request() req, @Body() set: boolean) {
    await this.profileService.setOtp(req.user.id, set);
  }
}
