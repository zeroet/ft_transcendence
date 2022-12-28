import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ path: '/chat', cors: '*' })
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(ChatEventsGateway.name);
  constructor() {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    this.logger.debug(`Chat socket id:${socket.id} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Chat socket id:${socket.id} disconnected`);
  }
}
