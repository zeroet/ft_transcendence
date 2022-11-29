import {
  Body,
  ExecutionContext,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { UserService } from 'src/users/services/user/user.service';
import { GameService } from './game.service';
import { RoomService } from './room.service';


@WebSocketGateway({ cors: '*' })
export class GameEvents {
  
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    private readonly authService: JwtAccessStrategy,
    ) {}
    
    
    @WebSocketServer()
    server: Server;
    
    room: RoomService = new RoomService;
    game: GameService = new GameService;

    
  async handleConnection(client: Socket) {
     await console.log(client);
  }

  handleDisConnection(clinet: Socket) {
    console.log(`Client Disconnected: ${clinet.id}`);
  }

  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: any) {
      if (!this.room.addUser(client))
        return ;
      if (this.room.isFull())
        this.room.readyQueue();
  }

  @SubscribeMessage('createRoom')
  createBrotliCompress(@ConnectedSocket() client :Socket, @MessageBody() roomName: string) {
      if(this.room.isOwner(client))
      {  
        const roomId = roomName;
        this.room.createRoom(roomId);
      }
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket) {
    this.server.emit('message', clinet.id, data);
  }
}
