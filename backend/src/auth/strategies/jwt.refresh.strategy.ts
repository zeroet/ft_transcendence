import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  private logger: Logger = new Logger(JwtRefreshStrategy.name);
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
      secretOrKey: `${process.env.JWT_REFRESH_SECRET}`,
      // passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    this.logger.log(`user_id: ${payload.id}`);
    // console.log('jwt.refresh.strategy validate()');
    // const decoded = this.jwtService.decode(payload);
    if (payload !== undefined) {
      const user = await this.userService.getUserById(payload.id);
      if (!user) throw new UnauthorizedException('Unauthorized User');
      return user;
    }
  }
}
