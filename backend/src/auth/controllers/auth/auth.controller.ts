import {
  Controller,
  Get,
  Inject,
  Post,
  Redirect,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { FtAuthGurad } from 'src/auth/guards/ft-auth.guard';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guards/jwt.refresh-auth.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Cookies } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('login')
  @Redirect('http://localhost:8000/Home', 301)
  async login(@Request() req, @Response({ passthrough: true }) res) {
    console.log('login user');
    if (!req.user) {
      console.log('login user doesnt exist');
      throw res.redirect(301, 'http://localhost:8080/auth/signup');
    }
    this.authService.setAccessToken(res, req.user.id);
    this.authService.setRefreshToken(res, req.user.id);
    return 'http://localhost:8000/Home';
  }

  @UseGuards(FtAuthGurad)
  @Get('signup')
  ftLogin() {
    console.log('42 signup');
  }

  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('redirect')
  async redirect(@Request() req, @Response({ passthrough: true }) res) {
    console.log('redirect func');
    this.authService.setAccessToken(res, req.user.id);
    this.authService.setRefreshToken(res, req.user.id);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Redirect('http://localhost:8000', 301)
  @Get('logout')
  async logout(@Response({ passthrough: true }) res) {
    res.cookie(Cookies.ACCESS_TOKEN, '', this.authService.defaultCookieOptions);
    // res.cookie(
    //   Cookies.REFRESH_TOKEN,
    //   '',
    //   this.authService.defaultCookieOptions,
    // );
    // return res.sendStatus(200);
  }
}
