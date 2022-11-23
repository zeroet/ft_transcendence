import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
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
    // console.log('jwt.access.strategy validate()');
    // console.log('jwt.access.strategy payload:', payload);
    if (payload === undefined)
      console.log('jwt.access.strategy payload:', payload);
    if (payload !== undefined) {
      const user = await this.userService.getUserById(payload.id);
      // console.log('current user before update:', user);
      if (!user) {
        console.log('jwt.access.strategy user not found');
        throw new UnauthorizedException('Unauthorized User');
        // console.log('jwt.access.strategy return user');
      }
      return user;
    }
  }
}
