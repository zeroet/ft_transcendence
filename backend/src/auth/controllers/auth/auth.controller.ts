import {
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FtAuthGurad } from 'src/auth/guards/ft-auth.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @UseGuards(FtAuthGurad)
  @Get('login')
  async login(@Request() req) {
    console.log('login');
    return 'success';
  }

  @UseGuards(FtAuthGurad)
  @Get('redirect')
  redirect() {
    console.log('sucess');
    return 'redirect';
  }

  @Get('profile')
  profile() {}

  @Get('logout')
  logout() {}
}
