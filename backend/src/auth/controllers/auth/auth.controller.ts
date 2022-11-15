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
    console.log('sucess, req.user:', req.user);
    // console.log('req.user.access_token:', req.user.access_token);
    // console.log('req.user.accessToken:', req.user.accessToken);
    // console.log('req.user.refresh_token:', req.user.refresh_token);
    // console.log('req.user.refreshToken:', req.user.refreshToken);
    res.cookie('Authentication', req.user.accessToken, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 360 * 1000,
    });
    res.cookie('Refresh', req.user.refreshToken, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 360 * 1000,
    });
  }

  @Get('profile')
  profile() {}

  @Get('logout')
  logout() {}
}
