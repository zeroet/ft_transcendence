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
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Cookies } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @UseGuards(FtAuthGurad)
  @Get('login')
  login() {}

  @UseGuards(FtAuthGurad)
  @Redirect('http://localhost:8000/Home', 301)
  @Get('redirect')
  async redirect(@Request() req, @Response({ passthrough: true }) res) {
    // console.log('sucess, req.user:', req.user);
    // console.log('req.user.access_token:', req.user.access_token);
    // console.log('req.user.accessToken:', req.user.accessToken);
    // console.log('req.user.refresh_token:', req.user.refresh_token);
    // console.log('req.user.refreshToken:', req.user.refreshToken);
    // const accessToken = this.authService.getAccessToken(req.user.id);
    // const refreshToken = this.authService.getRefreshToken(req.user.id);
    // console.log('accessToken:', accessToken);
    // console.log('refreshToken:', refreshToken);
    // res.cookie(Cookies.ACCESS_TOKEN, accessToken, {
    // domain: 'localhost',
    // path: '/',
    // httpOnly: true,
    // maxAge: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME),
    // });
    // res.cookie('Refresh', refreshToken, {
    // domain: 'localhost',
    // path: '/',
    // httpOnly: true,
    // maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME),
    // });
    res.user = req.user;
    console.log(res.user);
    this.authService.setAccessToken(res, req.user.id);
    this.authService.setRefreshToken(res, req.user.id);
  }

  @Get('profile')
  profile() {}

  @Get('logout')
  logout() {}
}
