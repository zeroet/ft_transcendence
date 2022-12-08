import {
  Controller,
  Get,
  Inject,
  Post,
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
import { Cookies, Status } from 'src/utils/types';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: IAuthService,
    @Inject('TWO_FACTOR_SERVICE') private twoFactorSerivce: TwoFactorService,
  ) {}

  @ApiOperation({
    summary: 'Login with refresh token / 리프레쉬토큰을 이용하여 로그인',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('login')
  async login(@User() user, @Res({ passthrough: true }) res) {
    if (!user) {
      console.log('login user doesnt exist');
      throw res.redirect(301, 'http://localhost:8080/auth/signup');
    }
    // console.log('auth/login() set cookies');
    const refreshToken = this.authService.getRefreshToken(user.id);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, user.two_factor_activated),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
    this.authService.setRefreshToken(user.id, refreshToken);
    this.authService.updateUserStatus(user.id, Status.LOGIN);
  }

  @ApiOperation({
    summary: 'Dummy login for test / 테스트용 더미 로그인',
  })
  @Redirect('http://localhost:8000/Home', 301)
  @Post('dummy')
  async test(@Res({ passthrough: true }) res) {
    const user = await this.authService.createDummyUser();
    console.log('test:', user);

    const refreshToken = this.authService.getRefreshToken(user.id);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, user.two_factor_activated),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
    this.authService.setRefreshToken(user.id, refreshToken);
  }

  @ApiOperation({ summary: 'Signup with 42API / 42API를 이용한 사용자등록' })
  @UseGuards(FtAuthGurad)
  @Get('signup')
  signup() {}

  @ApiOperation({
    summary: 'Redirection URL for 42API login / 42API 로그인 후 리다이렉션 URL',
  })
  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('redirect')
  async redirect(@User() user, @Res({ passthrough: true }) res) {
    // console.log('redirect()', user);
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
    this.authService.updateUserStatus(user.id, Status.LOGIN);
  }

  @ApiOperation({
    summary:
      'Reissue access token by refresh token / 리프레쉬토큰으로 엑세스토큰 재요청',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@User() user, @Res({ passthrough: true }) res) {
    const refreshToken = this.authService.getRefreshToken(user.id);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, user.two_factor_activated),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
    this.authService.setRefreshToken(user.id, refreshToken);
  }

  @ApiOperation({
    summary: 'Logout deleting access token / 로그아웃시 엑세스토큰을 삭제',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Redirect('http://localhost:8000', 301)
  @Get('logout')
  async logout(@User() user, @Res({ passthrough: true }) res) {
    res.clearCookie(
      Cookies.ACCESS_TOKEN,
      this.authService.defaultCookieOptions,
    );
    await this.twoFactorSerivce.setTwoFactorValid(user.id, false);
    if (await this.authService.deleteDummyUser(user)) {
      res.clearCookie(
        Cookies.REFRESH_TOKEN,
        this.authService.defaultCookieOptions,
      );
    }
    this.authService.updateUserStatus(user.id, Status.LOGOUT);
  }
}
