import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  private logger: Logger = new Logger(JwtAccessStrategy.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
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
    const userId = payload.id;
    const user = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.two_factor_secret')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      console.log('jwt.access.strategy user not found');
      throw new UnauthorizedException('Unauthorized User');
    }
    return user;
  }
}
