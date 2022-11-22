import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { TwoFactorService } from 'src/auth/services/two-factor/two-factor.service';
import { Cookies } from 'src/utils/types';

@ApiTags('TWO_FACTOR')
@Controller('two-factor')
export class TwoFactorContorller {
  constructor(
    @Inject('TWO_FACTOR_SERVICE') private twoFactorService: TwoFactorService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}

  @ApiOperation({
    summary: 'Two factor authentication',
    description:
      'You can authenticate by google authenticator with 2FA activated',
  })
  @ApiBadRequestResponse({
    description: 'You can authenticate only if you activated 2FA',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Post('authenticate')
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() { two_factor_code },
  ) {
    if (!req.user.two_factor_activated || !req.user.two_factor_secret)
      throw new BadRequestException('Two Factor is not activated');
    const isCodeValid = this.twoFactorService.validateTwoFactorCode(
      two_factor_code,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid authentication code');
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
    // return req.user;
  }

  @ApiOperation({
    summary: 'Generate QR code for 2FA before two factor authentication',
    description:
      'It generates a QR code for 2FA, you can authenticate it by google authenticator app',
  })
  @ApiBadRequestResponse({
    description: 'You can generate QR code only if you activated 2FA',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('generate')
  async register(@Req() req, @Res() res: Response) {
    console.log('generate');
    if (!req.user.two_factor_activated)
      throw new BadRequestException('Two factor is not activated');
    const { otpAuthUrl } = await this.twoFactorService.generateTwoFactorSecret(
      req.user,
    );
    return this.twoFactorService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @ApiOperation({ summary: 'Activate 2FA' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('activate')
  async activateTwoFactor(@Req() req, @Body() { set, two_factor_code }) {
    if (req.user.two_factor_activated)
      throw new BadRequestException('Two factor is already activated');
    if (!req.user.two_factor_secret)
      throw new BadRequestException(
        'You have to generate QR code for 2FA before activating it',
      );
    const isCodeValid = this.twoFactorService.validateTwoFactorCode(
      two_factor_code,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid authentication code');
    }
    await this.twoFactorService.setTwoFactorActivated(req.user.id, set);
  }
}
