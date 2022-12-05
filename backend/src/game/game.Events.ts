import { Inject, UseGuards } from '@nestjs/common';
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
import { JwtWsGuard } from 'src/auth/guards/jwt.ws.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';
import { Game, Status } from './interfaces/room';
import { QueueService } from './queue.service';
import { Logger } from '@nestjs/common';
import { dataCollectionPhase } from 'typeorm-model-generator/dist/src/Engine';

// @UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/game', cors: '*' })
export class GameEvents implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}
 
  private logger = new Logger('GameGateway');

  @WebSocketServer()
  server: Server;

  queueNormal: QueueService = new QueueService();
  // game: GameService = new GameService();
  rooms: Map<string, Game> = new Map();
  roomList: string[];

  afterInit() {
    this.logger.log("INIT");
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    // const payload = await this.authService.verify(
    //   client.handshake.headers.accesstoken,
    // );
    // const user = await this.userService.getUserById(payload.id);
    // if (!user) {
    //   client.disconnect();
    //   return;
    // }
    // client.data.user = user;
    this.logger.log('Lobbby', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Queue case 
    if (this.queueNormal.Players.indexOf(client) != -1)
      return await this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
    
    // InGame case
    for (const room of this.rooms.values())
      if (room.Players.indexOf(client) != -1) {
        // game end 
        await client.leave(room.roomName);
        return room.Players.splice(room.Players.indexOf(client), 1)
      }
    // Watcher case
    for (const room of this.rooms.values())
      if (room.Watchers.indexOf(client) != -1) {
        await client.leave(room.roomName);
        return room.Watchers.splice(room.Watchers.indexOf(client), 1)
      }
    this.logger.log('Game disconnection', client.id);
  }

  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: Socket) {
    if (!this.queueNormal.addUser(client)) return;
    if (this.queueNormal.isFull())
      this.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
  }

  createRoom(player1: Socket, palyer2: Socket) {

    console.log(player1.id, palyer2.id);
    player1.emit('createRoom', { isOwner: true });
    palyer2.emit('createRoom', { isOwner: false });
  }

  @SubscribeMessage('startGame')
  startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
      try {
        if (client.id === this.queueNormal.Players[0].id) {
        const game = new Game(this.queueNormal.Players, Status.READY, data.roomName, this.queueNormal.Players[0].id, data.speed, data.ballSize)
        this.queueNormal.Players.shift().join(data.roomName);
        this.queueNormal.Players.shift().join(data.roomName);
        this.rooms.set(data.roomName, game);
        this.liveGame(data.roomName, game);
      }
     }
     catch{}
    }

  async liveGame(name: string, game: Game) {
    await this.server.to(name).emit('enterGame', name);
  }
    
  @SubscribeMessage('room-list')
  handleRoomList() {
    try {
      for (const name of this.rooms.keys())
        this.roomList.push(name);
      const names = this.roomList;
      this.server.emit('room-list', { names })
    }
    catch{}
  }

  @SubscribeMessage('watchGame')
  watchGame(
    @ConnectedSocket() watcher: Socket, 
    @MessageBody() data:any) {
      if (!data.roomName)
        return ;
      for (const room of this.rooms.values())
         if (room.roomName === data.roomName) {
           watcher.join(data.roomName);
           room.Watchers.push(watcher);
           this.server.to(data.roomName).emit('enterGame', data.roomName);
      }
  }
}


