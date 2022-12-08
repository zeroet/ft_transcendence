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
import { GameService, Status } from './interfaces/room';
import { QueueService } from './queue.service';
import { Logger } from '@nestjs/common';
import { RoomService } from './room.service';
import { dataCollectionPhase } from 'typeorm-model-generator/dist/src/Engine';
// import { GameService } from './game.service';

@UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/game', cors: '*' })
export class GameEvents implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly roomService: RoomService,
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}
 
  private logger = new Logger('GameGateway');

  @WebSocketServer()
  server: Server;

  queueNormal: QueueService = new QueueService();
  
  afterInit() {
    this.logger.log("INIT");
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const payload = await this.authService.verify(
      client.handshake.headers.accesstoken,
    );
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.user = user;
    this.logger.log('Lobbby', client.data.user);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Queue case 
    if (this.queueNormal.Players.indexOf(client) != -1) {
      this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
      this.queueNormal.size -= 1;
    }
    // InGame case
    for (const room of this.roomService.rooms.values()){
      if (room.isOwner || room.isPlayer2) {
        // game end
        client.leave(room.roomName);
        await room.deletePlayer(client);
        if (room.Players.length == 0)
          this.roomService.rooms.delete(room.roomName);
      }
    }
    // Watcher case
    for (const room of this.roomService.rooms.values()) {
      if (room.Watchers.indexOf(client) != -1) {
        console.log('watcherrrr outttttttttttttt')
        room.Watchers.splice(room.Watchers.indexOf(client), 1)
        client.leave(room.roomName);    
      }
    }
    const list = this.roomService.roomList()
    this.server.emit('room-list', list);
  }


  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: Socket) {
    if (!this.queueNormal.addUser(client)) 
      return ;
    if (this.queueNormal.isFull())
    {
      console.log ('is in the full');
      this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
    } 
  }

  @SubscribeMessage('cancle')
  cancel(@ConnectedSocket() client: Socket) {
    console.log('cancle')
    try {
      if ((this.queueNormal.Players[0].id === client.id) || (this.queueNormal.Players[1].id === client.id)) {
        if (this.queueNormal.Players[0].id === client.id)
        {   
          this.queueNormal.Players[1].emit('close')
          console.log(this.queueNormal.Players[1].id);
        }
        else if (this.queueNormal.Players[1].id === client.id)
          this.queueNormal.Players[0].emit('close')
        this.queueNormal.Players.splice(0, 2)
        this.queueNormal.size -= 2;
      }
      else if (this.queueNormal.Players.indexOf(client) != -1) {
        this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
        this.queueNormal.size -= 1;
      }
      if (this.queueNormal.Players[0] && this.queueNormal.Players[1] && this.queueNormal.size >= 2)
        this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1])
      }
    catch{}
  }

  @SubscribeMessage('startGame')
  async startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
      try {
        if (client.id === this.queueNormal.Players[0].id) {
          this.roomService.startGame(this.queueNormal.Players[0], this.queueNormal.Players[1], Status.READY, data.roomName, this.queueNormal.Players[0].id, data.speed, data.ballSize)
          this.queueNormal.Players.shift().join(data.roomName);
          this.queueNormal.Players.shift().join(data.roomName);
          this.queueNormal.size -= 2;
        if (this.queueNormal.Players[0] && this.queueNormal.Players[1] && this.queueNormal.size >= 2)
         return this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
        this.liveGame(data.roomName);
      }
     }
     catch(e)
     {}
    }

  async liveGame(name: string) {
    for(const room of this.roomService.rooms.values()){
      console.log(name);
      console.log(room.Players[0].id);
      this.server.to(name).emit('enterGame', name);
      room.changeStatus(Status.PLAY);
    }
  }

  @SubscribeMessage('myname')
  myname(@ConnectedSocket() client: Socket, @MessageBody() data)
  {
    this.roomService.addName(client, data);
  }
 
    
  @SubscribeMessage('room-list')
  async handleRoomList() {
      const list = this.roomService.roomList();
      this.server.emit('room-list', list)
  }

  @SubscribeMessage('watchGame')
  watchGame(
    @ConnectedSocket() watcher: Socket, 
    @MessageBody() data:any) {
      if (!data)
        return ;
      this.roomService.addWatcher(watcher, data);
      this.server.to(data.roomName).emit('enterGame', data);
  }
}


