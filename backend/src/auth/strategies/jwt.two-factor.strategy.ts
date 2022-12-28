import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'two-factor',
) {
  constructor(@Inject('USER_SERVICE') private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload !== undefined) {
      const user = await this.userService.getUserById(payload.id);
      if (!user.two_factor_activated) {
        return user;
      }
      if (payload.two_factor_activated) {
        return user;
      }
    }
  }
}
