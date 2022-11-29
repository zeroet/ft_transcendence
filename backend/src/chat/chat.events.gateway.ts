import { Inject, Logger, UseGuards } from '@nestjs/common';
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
import { JwtWsGuard } from 'src/auth/guards/jwt.ws.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { Chatroom } from 'src/typeorm';
import { IUserService } from 'src/users/services/user/user.interface';
import { Repository } from 'typeorm';

@UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/chat', cors: '*' })
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(ChatEventsGateway.name);
  constructor(
    @Inject('AUTH_SERVICE') private authService: IAuthService,
    @Inject('USER_SERVICE') private userService: IUserService,
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>, // private readonly jwtAccessStrategy: JwtAccessStrategy,
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
    const payload = await this.authService.verify(
      socket.handshake.headers.accesstoken,
    );
    // console.log(socket.handshake.headers.accesstoken);
    // this.logger.debug('Chat events handleConnection(): ', payload.id);
    const user = await this.userService.getUserById(payload.id);
    !user && socket.disconnect();

    this.logger.debug(`User id:${user.id} has been connected`);
    this.logger.debug(`Chat socket id:${socket.id} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Chat socket id:${socket.id} disconnected`);
  }
}
