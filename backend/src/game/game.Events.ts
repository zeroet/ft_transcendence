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
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';
import { dataCollectionPhase } from 'typeorm-model-generator/dist/src/Engine';
import { GameService } from './game.service';
import { RoomName } from './interfaces/room';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: '*' })
export class GameEvents {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  room: RoomService = new RoomService();
  game: GameService = new GameService();

  handleConnection(client: Socket) {
    console.log('Lobby', client.id);
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
    if (this.room.isOwner(client)) this.room.createRoom(data[1].name);
    else console.log('Im not owner');
    this.server.to(client.data.roomName).emit('game', 'INTHEGAME');
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket) {
    this.server.emit('message', clinet.id, data);
  }
}
