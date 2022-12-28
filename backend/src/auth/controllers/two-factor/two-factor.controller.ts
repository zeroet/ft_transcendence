import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  TwoFactorActivatedDto,
  TwoFactorCodeDto,
  TwoFactorValidDto,
} from 'src/auth/dto';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { JwtTwoFactorAuthGuard } from 'src/auth/guards/jwt.two-factor-auth.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { ITwoFactorService } from 'src/auth/services/two-factor/two-factor.interface';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { User } from 'src/utils/decorators/user.decorator';
import { Cookies } from 'src/utils/types';

@ApiTags('TWO-FACTOR')
@Controller('two-factor')
export class TwoFactorContorller {
  constructor(
    @Inject('TWO_FACTOR_SERVICE') private twoFactorService: ITwoFactorService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}

  @ApiOperation({
    summary: 'Two factor authentication / 2FA 인증',
    description:
      'You can authenticate by google authenticator with 2FA activated',
  })
  @ApiBadRequestResponse({
    description: 'You can authenticate only if you activated 2FA',
  })
  @ApiBody({
    required: true,
    type: TwoFactorCodeDto,
    description: '6 digits code for 2FA',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Post('authenticate')
  async authenticate(
    @User() user: IUser,
    @Res({ passthrough: true }) res,
    @Body('two_factor_code') twoFactorCode: string,
  ) {
    if (!user.two_factor_activated || !user.two_factor_secret)
      throw new BadRequestException('Two Factor is not activated');
    const isCodeValid = this.twoFactorService.validateTwoFactorCode(
      user.two_factor_secret,
      twoFactorCode,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid authentication code');
    }
    const refreshToken = this.authService.getRefreshToken(user.id);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, true),
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      Cookies.REFRESH_TOKEN,
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
    this.authService.setRefreshToken(user.id, refreshToken);
    return true;
  }

  @ApiOperation({
    summary:
      'Generate QR code for 2FA before two factor authentication / 2FA 인증 전 2FA를 위한 QR코드 생성',
    description:
      'It generates a QR code for 2FA, you can authenticate it by google authenticator app',
  })
  @ApiBadRequestResponse({
    description: 'You can generate QR code only if you activated 2FA',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('generate')
  async register(@User() user: IUser, @Res() res: Response) {
    const otpAuthUrl = await this.twoFactorService.generateTwoFactorSecret(
      user,
    );
    return this.twoFactorService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @ApiBody({
    required: true,
    type: 'boolean',
    description: 'true value',
  })
  @ApiBody({
    required: true,
    type: TwoFactorCodeDto,
    description: '6 digits code for 2FA',
  })
  @ApiOperation({ summary: 'Activate 2FA / 2FA 활성화' })
  @UseGuards(JwtAccessAuthGuard)
  @Post('activate')
  async activateTwoFactor(
    @User() user,
    @Res({ passthrough: true }) res,
    @Body() { set, two_factor_code },
  ) {
    if (user.two_factor_activated)
      throw new BadRequestException('Two factor is already activated');
    if (!user.two_factor_secret)
      throw new BadRequestException(
        'You have to generate QR code for 2FA before activating it',
      );
    const isCodeValid = this.twoFactorService.validateTwoFactorCode(
      user.two_factor_secret,
      two_factor_code,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid authentication code');
    }
    await this.twoFactorService.setTwoFactorActivated(user.id, set);
    await this.twoFactorService.setTwoFactorValid(user.id, true);
    res.cookie(
      Cookies.ACCESS_TOKEN,
      this.authService.getAccessToken(user.id, set),
      this.authService.accessTokenCookieOptions,
    );
  }

  @ApiBody({
    required: true,
    type: TwoFactorActivatedDto,
    description: 'true',
  })
  @ApiOperation({ summary: 'Deactivate 2FA / 2FA 비활성화' })
  @UseGuards(JwtTwoFactorAuthGuard)
  @Post('deactivate')
  async deactivateTwoFactor(
    @User() user: IUser,
    @Body('set') twoFactorActivated: boolean,
  ) {
    if (!user.two_factor_activated)
      throw new BadRequestException('Two factor is not activated');
    await this.twoFactorService.setTwoFactorActivated(
      user.id,
      twoFactorActivated,
    );
  }

  @ApiBody({
    required: true,
    type: TwoFactorValidDto,
    description: 'true',
  })
  @UseGuards(JwtTwoFactorAuthGuard)
  @ApiOperation({ summary: 'Valid 2FA / 2FA 적용 유효성 확인' })
  @Post('valid')
  async validTwoFactor(
    @User() user: IUser,
    @Body('valid') twoFactorValid: boolean,
  ) {
    await this.twoFactorService.setTwoFactorValid(user.id, twoFactorValid);
  }
}
