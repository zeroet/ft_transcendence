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
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  private logger: Logger = new Logger(JwtAccessStrategy.name);
  constructor(@Inject('USER_SERVICE') private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: `${process.env.JWT_ACCESS_SECRET}`,
    });
  }

  async validate(payload: any) {
    this.logger.debug(
      `user_id: ${payload.id}, two_factor_activated: ${payload.two_factor_activated}`,
    );
    // if (payload !== undefined) {
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      console.log('jwt.access.strategy user not found');
      throw new UnauthorizedException('Unauthorized User');
    }
    return user;
    // }
  }
}
