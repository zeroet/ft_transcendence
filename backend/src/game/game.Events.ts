import { Body, ExecutionContext, Inject, Request, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { JwtAccessAuthGuard } from "src/auth/guards/jwt.access-auth.guard";
import { AuthService } from "src/auth/services/auth/auth.service";
import { JwtAccessStrategy } from "src/auth/strategies/jwt.access.strategy";
import { UserService } from "src/users/services/user/user.service";

@WebSocketGateway({cors: '*'})
export class GameEvents {
    constructor(
        @Inject('USER_SERVICE') private readonly userService: UserService,
        private readonly authService: JwtAccessStrategy
    ) {}

    @WebSocketServer()
    server: Server;

    // @UseGuards(JwtAccessAuthGuard)
    async handleConnection(client: Socket){
        const user = await this.authService.validate(client.handshake.headers.authorization)
        console.log("websocket", user);
        console.log(`CLient Conneted: ${client.id}`);
    }
    
    handleDisConnection(clinet: Socket){
        console.log(`Client Disconnected: ${clinet.id}`);
    }


    @SubscribeMessage('createRoom')
    createBrotliCompress(client: Socket, roomId: string){
            client.join(roomId);
            client.emit('getMessage', { message: "enter Room"})
        }

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket){
        this.server.emit('message', clinet.id, data);
    }
}