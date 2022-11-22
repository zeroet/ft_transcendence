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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FtAuthGurad } from 'src/auth/guards/ft-auth.guard';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guards/jwt.refresh-auth.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { User } from 'src/utils/decorators/user.decorator';
import { Cookies } from 'src/utils/types';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: IAuthService) {}

  @ApiOperation({ summary: 'login with jwt' })
  @UseGuards(JwtRefreshAuthGuard)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('login')
  async login(@User() user, @Response({ passthrough: true }) res) {
    console.log('login user');
    if (!user) {
      console.log('login user doesnt exist');
      throw res.redirect(301, 'http://localhost:8080/auth/signup');
    }
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, user.two_factor_activated),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      this.authService.getRefreshToken(user.id),
      this.authService.refreshTokenCookieOptions,
    );
  }

  @ApiOperation({ summary: 'signup with 42api' })
  @UseGuards(FtAuthGurad)
  @Get('signup')
  signup() {}

  @ApiOperation({ summary: 'redirection url for 42api login' })
  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('redirect')
  async redirect(@User() user, @Response({ passthrough: true }) res) {
    console.log('redirect()');
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, false),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      this.authService.getRefreshToken(user.id),
      this.authService.refreshTokenCookieOptions,
    );
  }

  @ApiOperation({ summary: 'logout deleting access token' })
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
