import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject('USER_SERVICE') private userService: IUserService,
    private jwtService: JwtService,
  ) {
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
    console.log('jwt.access.strategy payload:', payload);
    const decoded = this.jwtService.decode(payload);
    // const { id } = payload;

    // console.log('jwt.access.strategy id', id);
    // console.log('jwt.access.strategy decoded', decoded);
    // if (payload === undefined)
    //   console.log('jwt.access.strategy payload:', payload);
    if (payload !== undefined) {
      // console.log('jwt.access.strategy validate() payload:', payload.id);
      const user = await this.userService.getUserById(payload.id);
      if (!user) {
        console.log('jwt.access.strategy user not found');
        throw new UnauthorizedException('Unauthorized User');
        // console.log('jwt.access.strategy return user');
      }
      // console.log('jwt.access.strategy user:', user);
      return user;
      // console.log('current user before update:', user);
    }
  }
}
