import { Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { Chatroom } from 'src/typeorm';
import { UserService } from 'src/users/services/user/user.service';
import { Repository } from 'typeorm';

@WebSocketGateway({ path: '/chat', cors: '*' })
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(ChatEventsGateway.name);
  constructor(
    @Inject('USER_SERVICE') private userService: UserService,
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    private readonly jwtAccessStrategy: JwtAccessStrategy,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.emit('message', socket.id, message);
  }

  @SubscribeMessage('dm')
  handleDmMessage(
    @MessageBody() dmMessage: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.emit('dm', socket.id, dmMessage);
  }

  @SubscribeMessage('chatroom')
  handleChatroom() {
    const chatrooms = this.chatroomRepository.find();
    this.server.emit('chatroom', chatrooms);
  }

  @SubscribeMessage('test')
  test(socket: Socket, data: string) {
    socket.on('test', () => console.log('test', data));
  }

  async handleConnection(socket: Socket) {
    const currentUser = await this.jwtAccessStrategy.validate(
      socket.handshake.headers.accesstoken,
    );
    this.logger.log(`User id:${currentUser.id} has been connected`);
    this.logger.log(`Chat socket id:${socket.id} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Chat socket id:${socket.id} disconnected`);
  }
}
