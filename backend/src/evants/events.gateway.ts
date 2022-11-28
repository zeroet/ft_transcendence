import { Inject, Logger, Req, UseGuards } from '@nestjs/common';
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
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { UserService } from 'src/users/services/user/user.service';
import { User } from 'src/utils/decorators/user.decorator';

<<<<<<< HEAD
@WebSocketGateway({
  // namespace: 'chat',
  cors: process.env.CLINET_URL,
  // cors: '*',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
=======
// @UseGuards(JwtAccessAuthGuard)
@WebSocketGateway({ path: '/chat', cors: '*' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
>>>>>>> 9d3cfbad0fe6d9e28531035e1c02ffc376a722e8
  protected readonly logger = new Logger(EventsGateway.name);
  constructor(
    @Inject('USER_SERVICE') private userService: UserService,
    private readonly jwtAccessStrategy: JwtAccessStrategy,
  ) {}

<<<<<<< HEAD
  @WebSocketServer() server: Server;

  // @UseGuards(JwtAccessAuthGuard)
  async handleConnection(@ConnectedSocket() socket: Socket, @User() user) {
    const currentUser = await this.jwtAccessStrategy.validate(
      socket.handshake.headers.accesstoken,
    );
    console.log('chat socket connected', currentUser);

    // console.log('chat socket connected', user);
    this.logger.log('user has been connected');
    // this.logger.log(`Server path:${this.server} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Server path:${this.server.path} disconnected`);
    console.log('chat socket disconnected');
  }
=======
>>>>>>> 9d3cfbad0fe6d9e28531035e1c02ffc376a722e8

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

  // afterInit(server: any) {
  //   console.log(`Server path:${this.server.path}`);
  //   this.logger.log(`Server path:${this.server.path}`);
  // }

  @SubscribeMessage('test')
  test(socket: Socket, data: string) {
    socket.on('test', () => console.log('test', data));
  }
<<<<<<< HEAD
=======

  async handleConnection(socket: Socket) {
    const currentUser = await this.jwtAccessStrategy.validate(
      socket.handshake.headers.accesstoken,
    );
    console.log('chat socket connected', currentUser.id);
    console.log(`chat cliendt id : ${socket.id}`)
    this.logger.log('user has been connected');
    this.logger.log(`Server path:${this.server.path} connected`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Server path:${this.server.path} disconnected`);
    console.log('chat socket disconnected');
  }
>>>>>>> 9d3cfbad0fe6d9e28531035e1c02ffc376a722e8
}
