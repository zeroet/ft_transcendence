import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';

@UseGuards(JwtAccessAuthGuard)
@WebSocketGateway({ path: '/chat' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  protected readonly logger = new Logger(EventsGateway.name);
  constructor() {}

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.emit('message', socket.id, message);
  }

  @SubscribeMessage('dm')
  handleDmMessage(
    @MessageBody() dm: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.emit('dm', socket.id, dm);
  }

  afterInit(server: any) {
    this.logger.log(`Server path:${this.server.path}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Server path:${this.server.path} connected`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Server path:${this.server.path} disconnected`);
  }
}
