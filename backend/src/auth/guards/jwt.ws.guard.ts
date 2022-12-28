import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IAuthService } from '../services/auth/auth.interface';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class JwtWsGuard implements CanActivate {
  private logger: Logger = new Logger(JwtWsGuard.name);
  constructor(
    @Inject('AUTH_SERVICE') private authService: IAuthService,
    @Inject('USER_SERVICE') private userService: IUserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const socket: Socket = context.switchToWs().getClient<Socket>();
      const accessToken = socket.handshake.headers.accesstoken;
      const payload = await this.authService.verify(accessToken);
      this.logger.debug(
        `user_id: ${payload.id}, two_factor_activated: ${payload.two_factor_activated}`,
      );
      const user = this.userService.getUserById(payload.id);
      if (user) {
        context.switchToHttp().getRequest().user = user;
        return { user, socket };
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
