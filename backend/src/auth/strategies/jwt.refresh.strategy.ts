import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject('USER_SERVICE') private userService: IUserService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    // console.log('jwt.refresh.strategy validate()');
    // const decoded = this.jwtService.decode(payload);
    // console.log('refresh payload:', payload);
    // console.log('refresh decoded:', decoded);
    if (payload !== undefined) {
      console.log('refresh payload:', payload.id);
      const user = await this.userService.getUserById(payload.id);
      if (!user) throw new UnauthorizedException('Unauthorized User');
      return user;
    }
  }
}
