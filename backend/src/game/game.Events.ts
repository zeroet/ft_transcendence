import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway({cors: '*'})
export class GameEvents {

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket){
        console.log(`CLient Conneted: ${client.id}`);
    }
    
    handleDisConnection(clinet: Socket){
        console.log(`Client Disconnected: ${clinet.id}`);
    }

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() clinet: Socket){
        this.server.emit('message', clinet.id, data);
    }
}