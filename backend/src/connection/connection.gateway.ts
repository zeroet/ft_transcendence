
import { Server, Socket} from 'socket.io';
import { WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { ConnectionService } from './connection.service';
import { Inject, Logger } from '@nestjs/common'

@WebSocketGateway({path: '/game', cors: '*'})
export class ConnectionGateway{

    @WebSocketServer()
    server : Server;

    @Inject()
    private connectionSerivce: ConnectionService;

    private logger: Logger = new Logger('ConnectionGateway');

    async handleConnection(client: Socket) {
        this.logger.debug(`Client connected: ${client.id}`);
        try {
            await this.connectionSerivce.addConnection(client);
        }
        catch (err) {
            throw new WsException('unauthorized')
        }
    }

    async handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);
        try {
            await this.connectionSerivce.eraseConnection(client);
        } catch (err) {
            throw new WsException('unauthorized connection');
        }
    }
}