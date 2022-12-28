import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  private logger: Logger = new Logger(JwtRefreshStrategy.name);
  constructor(@Inject('USER_SERVICE') private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: `${process.env.JWT_REFRESH_SECRET}`,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`user_id: ${payload.id}`);
    if (payload !== undefined) {
      const user = await this.userService.getUserById(payload.id);
      if (!user) throw new UnauthorizedException('Unauthorized User');
      return user;
    }
  }
}
