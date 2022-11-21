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
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { Cookies } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: IAuthService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    console.log('login user');
    if (!req.user) {
      console.log('login user doesnt exist');
      throw res.redirect(301, 'http://localhost:8080/auth/signup');
    }
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(req.user.id),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      this.authService.getRefreshToken(req.user.id),
      this.authService.refreshTokenCookieOptions,
    );
  }

  @UseGuards(FtAuthGurad)
  @Get('signup')
  signup() {}

  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('redirect')
  async redirect(@Request() req, @Response({ passthrough: true }) res) {
    console.log('redirect func');
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(req.user.id),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      this.authService.getRefreshToken(req.user.id),
      this.authService.refreshTokenCookieOptions,
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Redirect('http://localhost:8000', 301)
  @Get('logout')
  async logout(@Response({ passthrough: true }) res) {
    res.clearCookie(
      Cookies.ACCESS_TOKEN,
      this.authService.defaultCookieOptions,
    );
  }
}
