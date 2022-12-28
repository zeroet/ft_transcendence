import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { ProfileService } from 'src/users/services/profile/profile.service';
import { User } from 'src/utils/decorators/user.decorator';
import { profileDTO } from '../../dto/profile.dto';

@ApiTags('SETTING')
@Controller('setting')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Update username / 사용자이름 변경' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('username')
  async changeUsername(@User() user: IUser, @Body() newUserName: profileDTO) {
    return await this.profileService.updateUserName(
      user.id,
      newUserName.username,
    );
  }

  @ApiOperation({ summary: 'Update user image / 사용자사진 변경' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('userimage')
  async changeUserImage(@User() user: IUser, @Body() newUserImage: profileDTO) {
    return await this.profileService.updateUserImage(
      user.id,
      newUserImage.image_url,
    );
  }
}
