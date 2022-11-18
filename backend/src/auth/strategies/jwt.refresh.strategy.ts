import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Cookies } from 'src/utils/types';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(@Inject('USER_SERVICE') private userService: IUserService) {
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

  async validate(req: Request, payload: any) {
    console.log('validate func in jwt.refresh', payload);
    //const refreshToken = req.get(`${Cookies.REFRESH_TOKEN}`);
    // .replace('Bearer', '')
    // .trim();
    const refreshToken = req.cookies?.refreshToken;
    const user = await this.userService.getUserById(payload.id);
    console.log(refreshToken);
    return user;
    // return {
    //   ...payload,
    //   refreshToken,
    // };
  }
}
