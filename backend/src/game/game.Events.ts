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

@UseGuards(JwtWsGuard)
@WebSocketGateway({ path: '/game', cors: '*' })
export class GameEvents
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
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
  queuePv: Map<number, Array<any>> = new Map();

  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Game socket id ${client.id}`);
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

    let map = this.queuePv.values();
    for (const q of map) {
      if (q.indexOf(client) != -1) {
        q[0].emit('Pcancel');
        q[1].emit('Pcancel');
        let user = await this.getUserfromSocket(q[0]);
        this.queuePv.delete(user.id);
        return;
      }
    }

    // Queue case

    if (this.queueNormal.Players.indexOf(client) != -1) {
      let user = await this.getUserfromSocket(client);
      // Queue READY case
      if (user.status === Status.LOGOUT) {
        this.queueNormal.Players[0].emit('close');
        this.queueNormal.Players[1].emit('close');
        this.queueNormal.Players.splice(0, 2);
        this.queueNormal.size -= 2;
        if (
          this.queueNormal.Players[0] &&
          this.queueNormal.Players[1] &&
          this.queueNormal.size >= 2
        )
          this.roomService.createRoom(
            this.queueNormal.Players[0],
            this.queueNormal.Players[1],
          );
        return;
      } else if (
        this.queueNormal.Players[0] === client ||
        this.queueNormal.Players[1] === client
      ) {
        this.queueNormal.Players[0].emit('close');
        this.queueNormal.Players[1].emit('close');
        this.queueNormal.Players.splice(0, 2);
        this.queueNormal.size -= 2;
        if (
          this.queueNormal.Players[0] &&
          this.queueNormal.Players[1] &&
          this.queueNormal.size >= 2
        )
          this.roomService.createRoom(
            this.queueNormal.Players[0],
            this.queueNormal.Players[1],
          );
        return;
      } else if (
        this.queueNormal.Players[0].id === client.id &&
        !this.queueNormal.Players[1]
      ) {
        this.queueNormal.Players.splice(0, 1);
        this.queueNormal.size = 0;
      } else {
        console.log(user.status);
        this.queueNormal.Players.splice(
          this.queueNormal.Players.indexOf(client),
          1,
        );
        this.queueNormal.size -= 1;
        console.log('DISCONNECTION CLINET SOCKET');
        return;
      }
    }

    // InGame case
    for (const room of this.roomService.rooms.values()) {
      if (room.isPlayer(client)) {
        // let U = await this.getUserfromSocket(client);
        // this.userService.updateUserStatus(U.id, Status.LOGOUT)
        await room.deletePlayer(client);
        console.log('DISCONNECTION,,, PLAYER,,,DELETE,,,ROOM');
        if (room.Players.length == 0) {
          this.roomService.rooms.delete(room.roomName);
          console.log('DISCONNECTION....0 PLAYER DELETE ROOM');
        }
      }
    }
    // Watcher case
    if (this.roomService.watcherOut(client)) {
      const user = await this.getUserfromSocket(client);
      console.log('DISCONNECTION...WATCHER....', user.username, user.status);
      this.userService.updateUserStatus(user.id, Status.LOGIN);
      console.log('DISCONNECTION WATCHER....', user.username, user.status);
    }
    const list = this.roomService.roomList();
    this.server.emit('room-list', list);
  }

  async getUserfromSocket(client: Socket) {
    try {
      const payload = await this.authService.verify(
        client.handshake.headers.accesstoken,
      );
      const user = await this.userService.getUserById(payload.id);
      return user;
    } catch {}
  }

  @SubscribeMessage('Queue')
  async readyGame(@ConnectedSocket() client: Socket) {
    if (!client) return;
    const user = await this.getUserfromSocket(client);
    if (!user) return;
    console.log('stattttttttttttttt', user.username, user.status);
    let stat: string = user.status;
    if (stat === 'Game') {
      client.emit('playing');
      return;
    }
    for (const player of this.queueNormal.Players) {
      // same socket id in the queue Case
      let tmp = await this.getUserfromSocket(player);
      if (user.id === tmp.id) return console.log('same Userrrrrrrrrrr out');
    }
    if (!this.queueNormal.addUser(client)) return;
    if (this.queueNormal.isFull())
      this.roomService.createRoom(
        this.queueNormal.Players[0],
        this.queueNormal.Players[1],
      );
  }

  @SubscribeMessage('x')
  x(@ConnectedSocket() client: Socket) {
    console.log('xxxxxxxxxxxxxx');
    if (!this.queueNormal.Players[0]) return;
    if (
      this.queueNormal.Players[0].id === client.id &&
      this.queueNormal.size === 1
    ) {
      console.log('in the ifffffffff');
      this.queueNormal.Players.splice(0, 1);
      this.queueNormal.size = 0;
      return;
    }
  }

  @SubscribeMessage('cancle')
  async cancel(@ConnectedSocket() client: Socket) {
    try {
      if (
        this.queueNormal.Players[0].id === client.id &&
        this.queueNormal.size === 1
      ) {
        this.queueNormal.Players.splice(0, 1);
        this.queueNormal.size = 0;
        console.log('size 1111111111 cancel');
        return;
      }

      //ready 0 / 1 index
      if (
        this.queueNormal.Players[0].id === client.id ||
        this.queueNormal.Players[1].id === client.id
      ) {
        if (this.queueNormal.Players[0].id === client.id)
          this.queueNormal.Players[1].emit('close');
        else if (this.queueNormal.Players[1].id === client.id)
          this.queueNormal.Players[0].emit('close');
        this.queueNormal.Players.splice(0, 2);
        this.queueNormal.size -= 2;
      }
      // 2 ~ end index
      else if (this.queueNormal.Players.indexOf(client) != -1) {
        this.queueNormal.Players.splice(
          this.queueNormal.Players.indexOf(client),
          1,
        );
        this.queueNormal.size -= 1;
      }
      //after cancel 0/1 index - > 2/3 <<
      if (
        this.queueNormal.Players[0] &&
        this.queueNormal.Players[1] &&
        this.queueNormal.size >= 2
      )
        this.roomService.createRoom(
          this.queueNormal.Players[0],
          this.queueNormal.Players[1],
        );
    } catch {}
  }

  @SubscribeMessage('startGame')
  async startGame(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
      if (client.id === this.queueNormal.Players[0].id) {
        let user1 = await this.getUserfromSocket(client);
        let user2 = await this.getUserfromSocket(this.queueNormal.Players[1]);
        this.userService.updateUserStatus(user1.id, Status.READY);
        this.userService.updateUserStatus(user2.id, Status.READY);
        this.roomService.startGame(
          user1,
          user2,
          this.queueNormal.Players[0],
          this.queueNormal.Players[1],
          Stat.READY,
          data.roomName,
          this.queueNormal.Players[0].id,
          data.speed,
          data.ballSize,
        );
        await this.userService.updateUserStatus(user1.id, Status.PLAYING);
        await this.userService.updateUserStatus(user2.id, Status.PLAYING);
        this.queueNormal.Players.shift().join(data.roomName);
        this.queueNormal.Players.shift().join(data.roomName);
        this.queueNormal.size -= 2;
        if (
          this.queueNormal.Players[0] &&
          this.queueNormal.Players[1] &&
          this.queueNormal.size >= 2
        )
          await this.roomService.createRoom(
            this.queueNormal.Players[0],
            this.queueNormal.Players[1],
          );
        this.liveGame(data.roomName);
      }
    } catch (e) {}
  }

  liveGame(name: string) {
    for (const room of this.roomService.rooms.values()) {
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
    this.server.emit('room-list', list);
  }

  @SubscribeMessage('watchGame')
  async watchGame(
    @ConnectedSocket() watcher: Socket,
    @MessageBody() data: any,
  ) {
    if (!data) return;
    let tmp = this.roomService.findRoom(data);
    if (!tmp) {
      watcher.emit('roomx');
      return;
    }

    console.log('event on WatchGame');
    if (this.queueNormal.Players.indexOf(watcher) != -1) {
      this.queueNormal.Players.splice(
        this.queueNormal.Players.indexOf(watcher),
        1,
      );
      this.queueNormal.size -= 1;
    }

    // check if watch User is already playing to another window
    const user = await this.getUserfromSocket(watcher);
    let stat: string = user.status;
    if (stat === 'Game') {
      console.log('user is playing cant watching other game');
      watcher.emit('playing');
      return;
    }

    const Room = this.roomService.findRoom(data);
    if (Room.Status != Stat.END) {
      for (const watcher of Room.Watchers) {
        let tmpUser = await this.getUserfromSocket(watcher);
        if (tmpUser.status === Status.WATCHING)
          return console.log('user watching other game !!!!');
      }
      console.log('OK ADD Watcherrrrr', user.username, user.status);
      this.userService.updateUserStatus(user.id, Status.WATCHING);
      this.roomService.addWatcher(watcher, data);
      this.server.to(data.roomName).emit('enterGame', data);
    }
  }

  //up : 1 // down: 2
  @SubscribeMessage('paddle')
  paddle(@ConnectedSocket() client: Socket, @MessageBody() data) {
    if (!data) return;
    this.roomService.movePaddle(client, data);
  }

  //----------------------------------------------------------------------------------------------------------------------------///
  //-----------------------------                  PRIVATE  GAME                     -------------------------------------------///
  //-------------
  //---------------------------------------------------------------------------------------------------------------///

  // private Queue
  @SubscribeMessage('privateQ')
  async privateQ(@ConnectedSocket() client: Socket, @MessageBody() data) {
    //get connection list
    let connec = this.connectionService.connections;

    //find sender Id && receiver Id to list && stat check
    const sender = await this.getUserfromSocket(client);
    const sockets: Set<Socket> = await connec.get(data);
    const receiver = await this.userService.getUserById(data);
    let statSender: string = sender.status;
    let stat: string = receiver.status;

    if (receiver.status === Status.LOGOUT) {
      client.emit('Logout');
      return;
    }

    if (this.queueNormal.Players.indexOf(client) != -1) {
      client.emit('IsPlaying');
      return;
    }

    if (sockets) {
      for (const socket of sockets) {
        if (this.queueNormal.Players.indexOf(socket) != -1) {
          client.emit('IsPlaying');
          return;
        }
      }
    } else return;

    // if sender && receiver stat is Playing or Watching
    // event isPlaying for cancel Q
    if (
      statSender === 'Game' ||
      stat === 'Game' ||
      statSender === Status.WATCHING ||
      receiver.status === Status.WATCHING
    ) {
      console.log('IsPlaying');
      client.emit('IsPlaying');
      return;
    }

    // else Make Map < Key : senderId, Value : Array[sender, recevier]>
    // this.PrivateQ.push(client);
    if (this.queuePv.has(sender.id)) {
      console.log('Sender -- invite ING // Array Existe in the map');
      this.queuePv.delete(sender.id);
    } else {
      const Pqueue: Array<any> = [client];
      this.queuePv.set(sender.id, Pqueue);
      client.emit('createQ');
      if (!sockets) return;
      for (const socket of sockets) {
        socket.emit('createQ', sender.id, sender.username); // emit to Socket body { sender.id } number
        console.log('CREATEQ SEND EMIT', socket.id, sender.username);
      }
    }
  }

  @SubscribeMessage('inviteCancel')
  async inviteCancel(@ConnectedSocket() client: Socket, @MessageBody() data?) {
    // receiver cancel invitation
    if (data) {
      let Pq = this.queuePv.get(data);
      Pq[0].emit('Pcancel');
      this.queuePv.delete(data);
      return;
    }
  }

  @SubscribeMessage('Private')
  async startPrivateQ(
    @ConnectedSocket() client: Socket,
    @MessageBody() data?, // data receiver send event to server with { sender.id } // if socket is sender, data is null
  ) {
    let receiver;
    if (!data) return;
    if (this.queuePv.has(data)) {
      const Pq: Array<any> = this.queuePv.get(data);
      if (Pq.length == 2) return;
      else {
        Pq.push(client);
        Pq[0].emit('privateRoom', { isOwner: true });
        Pq[1].emit('privateRoom', { isOwner: false });
        console.log(`Owner ${Pq[0].id}, Receiver${Pq[1].id}`);
      }
    }
    return;
  }

  @SubscribeMessage('Pcancel')
  async Pcancel(@ConnectedSocket() client: Socket) {
    let map = this.queuePv.values();
    for (const q of map) {
      if (q.indexOf(client) != -1) {
        q[0].emit('Pcancel');
        q[1].emit('Pcancel');
        let user = await this.getUserfromSocket(q[0]);
        this.queuePv.delete(user.id);
      }
    }
  }

  @SubscribeMessage('PrivateGame')
  async PrivateGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    let Owner = await this.getUserfromSocket(client);
    if (!this.queuePv.has(Owner.id)) return;
    try {
      const Pq: Array<any> = this.queuePv.get(Owner.id);
      if (client.id === Pq[0].id) {
        let user1 = await this.getUserfromSocket(client);
        let user2 = await this.getUserfromSocket(Pq[1]);
        this.userService.updateUserStatus(user1.id, Status.READY);
        this.userService.updateUserStatus(user2.id, Status.READY);
        this.roomService.startGame(
          user1,
          user2,
          Pq[0],
          Pq[1],
          Stat.READY,
          data.roomName,
          Pq[0].id,
          data.speed,
          data.ballSize,
        );
        await this.userService.updateUserStatus(user1.id, Status.PLAYING);
        await this.userService.updateUserStatus(user2.id, Status.PLAYING);
        Pq[0].join(data.roomName);
        Pq[1].join(data.roomName);
        this.queuePv.delete(Owner.id);
        // if (this.queueNormal.Players[0] && this.queueNormal.Players[1] && this.queueNormal.size >= 2)
        //   await this.roomService.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1]);
        this.liveGame(data.roomName);
      }
    } catch (e) {}
  }
}
