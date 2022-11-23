import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { ProfileService } from 'src/users/services/profile/profile.service';
import { User } from 'src/utils/decorators/user.decorator';
import { profileDTO } from '../../dto/profile.dto';

@ApiTags('SETTING')
@Controller('setting')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBody({
    type: profileDTO,
  })
  @ApiOperation({ summary: 'Update username / 사용자이름 변경' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('username')
  async changeUsername(@User() user, @Body() newUserName: profileDTO) {
    // if (newUserName.username.length > 30) throw new BadRequestException('Username is tool long (max 30)');
    console.log('post username in ');
    console.log(newUserName);
    await this.profileService.updateUserName(user.id, newUserName.username);
  }
  @ApiBody({
    type: profileDTO,
  })
  @ApiOperation({ summary: 'Update user image / 사용자사진 변경' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('userimage')
  async changeUserImage(@User() user, @Body() newUserImage: profileDTO) {
    await this.profileService.updateUserImage(user.id, newUserImage.image_url);
  }
}
