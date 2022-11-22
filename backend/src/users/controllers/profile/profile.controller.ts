import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
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
}
