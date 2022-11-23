import {
  Controller,
  Get,
  Inject,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FtAuthGurad } from 'src/auth/guards/ft-auth.guard';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guards/jwt.refresh-auth.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { TwoFactorService } from 'src/auth/services/two-factor/two-factor.service';
import { User } from 'src/utils/decorators/user.decorator';
import { Cookies } from 'src/utils/types';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: IAuthService,
    @Inject('TWO_FACTOR_SERVICE') private twoFactorSerivce: TwoFactorService,
  ) {}

  @ApiOperation({ summary: 'login with jwt' })
  @UseGuards(JwtRefreshAuthGuard)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('login')
  async login(@User() user, @Res({ passthrough: true }) res) {
    console.log('auth/login()');
    if (!user) {
      console.log('login user doesnt exist');
      throw res.redirect(301, 'http://localhost:8080/auth/signup');
    }
    console.log('auth/login() set cookies');
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
  async redirect(@User() user, @Res({ passthrough: true }) res) {
    console.log('redirect()');

    const refreshToken = this.authService.getRefreshToken(user.id);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, false),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
    this.authService.setRefreshToken(user.id, refreshToken);
  }

  @ApiOperation({ summary: 'request reissue access token by refresh token' })
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@User() user, @Res({ passthrough: true }) res) {
    console.log('auth/refresh()');
    // this.authService.setRefreshToken(user.id, )
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

  @ApiOperation({ summary: 'logout deleting access token' })
  @UseGuards(JwtAccessAuthGuard)
  @Redirect('http://localhost:8000', 301)
  @Get('logout')
  async logout(@User() user, @Res({ passthrough: true }) res) {
    res.clearCookie(
      Cookies.ACCESS_TOKEN,
      this.authService.defaultCookieOptions,
    );
    await this.twoFactorSerivce.setTwoFactorValid(user.id, false);
  }
}
