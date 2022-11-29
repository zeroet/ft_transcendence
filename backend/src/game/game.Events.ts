import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';

@WebSocketGateway({ cors: '*' })
export class GameEvents {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  // @UseGuards(JwtAccessAuthGuard)
  async handleConnection(client: Socket) {
    const payload = await this.authService.verify(
      client.handshake.headers.accesstoken,
    );
    const user = await this.userService.getUserById(payload.id);
    !user && client.disconnect();
    console.log('websocket', user);
    console.log(`CLient Conneted: ${client.id}`);
  }

  handleDisConnection(clinet: Socket) {
    console.log(`Client Disconnected: ${clinet.id}`);
  }

  @SubscribeMessage('createRoom')
  createBrotliCompress(client: Socket, roomId: string) {
    client.join(roomId);
    client.emit('getMessage', { message: 'enter Room' });
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket) {
    this.server.emit('message', clinet.id, data);
  }
}
