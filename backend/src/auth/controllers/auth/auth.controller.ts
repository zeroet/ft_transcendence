import {
  Controller,
  Get,
  Inject,
  Post,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { response, Response } from 'express';
import { FtAuthGurad } from 'src/auth/guards/ft-auth.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @UseGuards(FtAuthGurad)
  @Get('login')
  login() {}

  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000', 301)
  @Get('redirect')
  async redirect(@Request() req) {
    console.log('sucess, req.user:', req.user);
    return 'redirect';
  }

  @Get('profile')
  profile() {}

  @Get('logout')
  logout() {}
}
