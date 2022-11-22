import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TwoFactorCode } from 'src/auth/dto/twofactorcode.dto';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { JwtTwoFactorAuthGuard } from 'src/auth/guards/jwt.two-factor-auth.guard';
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
  @ApiBody({
    required: true,
    type: TwoFactorCode,
    description: '6 digits code for 2FA',
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
      this.authService.getAccessToken(req.user.id, true),
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
    // if (!req.user.two_factor_activated)
    //   throw new BadRequestException('Two factor is not activated');
    const { otpAuthUrl } = await this.twoFactorService.generateTwoFactorSecret(
      req.user,
    );
    // console.log('otpauthurl', otpAuthUrl);
    // const result = this.twoFactorService.pipeQrCodeStream(res, otpAuthUrl);
    // console.log('result', typeof result, result);
    return this.twoFactorService.pipeQrCodeStream(res, otpAuthUrl);
    // return result;
  }

  @ApiBody({
    required: true,
    type: 'boolean',
    description: 'true value',
  })
  @ApiBody({
    required: true,
    type: TwoFactorCode,
    description: '6 digits code for 2FA',
  })
  @ApiOperation({ summary: 'Activate 2FA' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('activate')
  async activateTwoFactor(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() { set, two_factor_code },
  ) {
    console.log('two factor activated:', req.user.two_factor_activated);
    console.log('two factor secret:', req.user.two_factor_secret);
    console.log('two factor code:', two_factor_code);
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
    console.log('iscodeinvalid:', isCodeValid);
    if (!isCodeValid) {
      console.log('code invalid');
      throw new UnauthorizedException('Invalid authentication code');
    }
    await this.twoFactorService.setTwoFactorActivated(req.user.id, set);
    // console.log(
    //   'activate() user.two_factor_activated:',
    //   req.user.two_factor_activated,
    // );
    console.log('activate() set:', set);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(req.user.id, set),
      this.authService.accessTokenCookieOptions,
    );
  }

  @ApiBody({
    required: true,
    type: 'boolean',
    description: 'true value',
  })
  @ApiOperation({ summary: 'Deactivate 2FA' })
  @UseGuards(JwtTwoFactorAuthGuard)
  @Post('deactivate')
  async deactivateTwoFactor(@Req() req, @Body() { set }) {
    console.log('deactivate() set:', set);
    if (!req.user.two_factor_activated)
      throw new BadRequestException('Two factor is not activated');
    await this.twoFactorService.setTwoFactorActivated(req.user.id, set);
  }
}