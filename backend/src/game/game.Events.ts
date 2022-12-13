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
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from 'src/auth/guards/jwt.ws.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';
import { Stat } from './interfaces/room';
import { QueueService } from './queue.service';
import { Logger } from '@nestjs/common';
import { RoomService } from './room.service';
import { ConnectionService } from 'src/connection/connection.service';
import { Status } from 'src/utils/types';
// import { GameService } from './game.service';

@UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/game', cors: '*' })
export class GameEvents implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly roomService: RoomService,
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
    private connectionService: ConnectionService,
  ) {}
 

  private logger = new Logger('GameGateway');

  @WebSocketServer()
  server: Server;

  connections = this.connectionService.connections;
  queueNormal: QueueService = new QueueService();
  
  afterInit() {

  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Game socket id ${client.id}`)
    try {
      await this.connectionService.addConnection(client);
    } catch (err) {
      throw new WsException('unauthorized: unauthenticated connection');
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      await this.connectionService.eraseConnection(client);
    } catch (err) {
      throw new WsException('unauthorized connection');
    }
    // Queue case 
    if (this.queueNormal.Players.indexOf(client) != -1) {
      this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
      this.queueNormal.size -= 1;
      return ;
    }
    // InGame case
    for (const room of this.roomService.rooms.values()){
      if (room.isPlayer(client)) {
        // game end
        // client.leave(room.roomName);
        await room.deletePlayer(client);
        if (room.Players.length == 0)
        this.roomService.rooms.delete(room.roomName);
      }
    }
    // Watcher case
    if(this.roomService.watcherOut(client))
    {
      for(const room of this.roomService.rooms.values())

      return ;
    }
    const list = this.roomService.roomList()
    this.server.emit('room-list', list);
  }

  async getUserfromSocket(client:Socket)
  {
    try { 
      const payload = await this.authService.verify(client.handshake.headers.accesstoken)
      const user = await this.userService.getUserById(payload.id)
      return user
    }
    catch{}
  }

  @SubscribeMessage('Queue')
  async readyGame(@ConnectedSocket() client: Socket) {
    if (!client) 
      return ;
    const user = await this.getUserfromSocket(client)
    console.log('stattttttttttttttt', user.username, user.status)
    let stat:string = user.status
    if (stat === 'Game') {
      client.emit('playing');
      return ;
    }
    for(const player of this.queueNormal.Players)
    {
      // same socket id in the queue Case
      let tmp = await this.getUserfromSocket(player)
      if (user.id === tmp.id) return console.log('same Userrrrrrrrrrr out') ;
    }
    if (!this.queueNormal.addUser(client)) 
      return ;
    if (this.queueNormal.isFull())
      this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
  }

  @SubscribeMessage('cancle')
  cancel(@ConnectedSocket() client: Socket) {
    try {
      //ready 0 / 1 index
      if ((this.queueNormal.Players[0].id === client.id) || (this.queueNormal.Players[1].id === client.id)) {
        if (this.queueNormal.Players[0].id === client.id)
          this.queueNormal.Players[1].emit('close')
        else if (this.queueNormal.Players[1].id === client.id)
          this.queueNormal.Players[0].emit('close')
        this.queueNormal.Players.splice(0, 2)
        this.queueNormal.size -= 2;
      }
      // 2 ~ end index 
      else if (this.queueNormal.Players.indexOf(client) != -1) {
        this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
        this.queueNormal.size -= 1;
      }
      //after cancel 0/1 index - > 2/3 << 
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
          let user1 = await this.getUserfromSocket(client);
          let user2 = await this.getUserfromSocket(this.queueNormal.Players[1])
          this.roomService.startGame(user1, user2, this.queueNormal.Players[0], 
            this.queueNormal.Players[1], Stat.READY, data.roomName, 
            this.queueNormal.Players[0].id, data.speed, data.ballSize)
          await this.userService.updateUserStatus(user1.id, Status.PLAYING)
          await this.userService.updateUserStatus(user2.id, Status.PLAYING)
          this.queueNormal.Players.shift().join(data.roomName);
          this.queueNormal.Players.shift().join(data.roomName);
          this.queueNormal.size -= 2;
        if (this.queueNormal.Players[0] && this.queueNormal.Players[1] && this.queueNormal.size >= 2)
          await this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
        this.liveGame(data.roomName);
      }
     }
     catch(e)
     {}
    }

    liveGame(name: string) {
    for(const room of this.roomService.rooms.values()){
      console.log(name);
      console.log(room.Players[0].id);
      this.server.to(name).emit('enterGame', name);
      room.changeStatus(Stat.PLAY);
    }
  }

  @SubscribeMessage('myname')
  myname(@ConnectedSocket() client: Socket, @MessageBody() data) {
    this.roomService.addName(client, data);
  }
    
  @SubscribeMessage('room-list')
  async handleRoomList() {
      const list = this.roomService.roomList();
      this.server.emit('room-list', list)
  }

  @SubscribeMessage('watchGame')
  async watchGame(
    @ConnectedSocket() watcher: Socket, 
    @MessageBody() data:any) {
      if (!data)
        return ;
      
      // check if watch User is already playing to another window
      const user = await this.getUserfromSocket(watcher);
      let stat:string = user.status
      if (stat === 'Game') {
        watcher.emit('playing');
        return ;
      }



      const Room = this.roomService.findRoom(data);
      for (const player of Room.Players)
      {
        let stat:string;
        let tmpUser = await this.getUserfromSocket(player)
        stat = tmpUser.status
        if(stat === 'Game' || stat === 'Logout' || stat === 'Watching')
          return ;
      }
      // for (const watcher of Room.Watchers)
      // {
      //   let tmpUser = await this.getUserfromSocket(watcher)
      //   if (user.id === tmpUser.id) return ;
      // }
      this.roomService.addWatcher(watcher, data);
      this.userService.updateUserStatus(user.id, Status.WATCHING);
      this.server.to(data.roomName).emit('enterGame', data);
      console.log('watchersTattttttttttttttt', user.username, user.status);
  }

  //up : 1 // down: 2
  @SubscribeMessage('paddle')
  paddle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data){
      if(!data)
        return ;
      this.roomService.movePaddle(client, data);
  }


  // private Queue
  

}


