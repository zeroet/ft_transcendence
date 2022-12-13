import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// @UseFilters(new BaseWsExceptionFilter())
// @UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/chat', cors: '*' })
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(ChatEventsGateway.name);
  constructor() {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    // const payload = await this.authService.verify(
    //   socket.handshake.headers.accesstoken,
    // );
    // console.log(socket.handshake.headers.accesstoken);
    // this.logger.debug('Chat events handleConnection(): ', payload.id);
    // const user = await this.userService.getUserById(payload.id);
    // if (!user) {
    //   socket.disconnect();
    //   return;
    // }
    // this.logger.debug(`User id:${user.id} has been connected`);
    this.logger.debug(`Chat socket id:${socket.id} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Chat socket id:${socket.id} disconnected`);
  }
}
