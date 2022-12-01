import {
  Body,
  ExecutionContext,
  HttpException,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from 'src/auth/guards/jwt.ws.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';
import { dataCollectionPhase } from 'typeorm-model-generator/dist/src/Engine';
import { GameService } from './game.service';
import { RoomName } from './interfaces/room';
import { RoomService } from './room.service';

@UseGuards(JwtWsGuard)
@WebSocketGateway({ cors: '*' })
export class GameEvents {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  room: RoomService = new RoomService();
  game: GameService = new GameService();

  async handleConnection(client: Socket) {
    const payload = await this.authService.verify(
      client.handshake.headers.accesstoken,
    );
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.user = user;
    console.log('Lobby', client.data.user.username);
  }

  handleDisConnection(clinet: Socket) {
    console.log(`Client Disconnected: ${clinet.id}`);
  }

  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: any) {
    if (!this.room.addUser(client)) return;
    if (this.room.isFull()) this.room.readyQueue();
  }

  @SubscribeMessage('createRoom')
  createBrotliCompress(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomName,
  ) {
    console.log(data.name);
    if (this.room.isOwner(client)) this.room.createRoom(data.name);
    else if (this.room.isPlayer(client, data.name, data.ready))
      console.log('ROOOOOOOOOOOM', this.room.rooms.has(data.name));
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket) {
    this.server.emit('message', clinet.id, data);
  }
}
