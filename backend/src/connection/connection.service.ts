
import { UserService } from "src/users/services/user/user.service";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { Status } from 'src/utils/types';
import { Injectable, Inject } from "@nestjs/common";
import { IAuthService } from 'src/auth/services/auth/auth.interface';

@Injectable()
export class ConnectionService{
    constructor(
        @Inject('USER_SERVICE') private readonly userService: UserService,
        @Inject('AUTH_SERVICE') private authService: IAuthService,
    ) {}

    connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();

    async getUserFromSocket(socket: Socket)
    {
        const payload = await this.authService.verify(socket.handshake.headers.accesstoken)
        if (!payload)
            throw new WsException('unAuthorized')
        const user = await this.userService.getUserById(payload.id);
        if (!user)
            throw new WsException('unAuthorized')
        return user;
    }

    async addConnection(socket: Socket) {
        //test
        let user;
        try {
            user = await this.getUserFromSocket(socket);
        }
        catch(e) {
            socket.disconnect();
            return ;
        }
        let sockets: Set<Socket> = this.connections.get(user.id);
        if (!sockets) {
            await this.userService.updateUserStatus(user.id, Status.LOGIN);
            sockets = new Set<Socket>();
            sockets.add(socket);
            this.connections.set(user.id, sockets);
        }
        else {
            sockets.add(socket);
            this.connections[user.id] = sockets;
            // console.log(`User ${user.username} is already Connected in GameServer failed Connection ${socket.id}`)
            // socket.disconnect();


        }
    }

    async eraseConnection(socket: Socket) {
        let user;
        // test
        // end

         try {
            user = await this.getUserFromSocket(socket);
        } catch (e) {
            socket.disconnect();
            return;
        }
        try {
            const sockets: Set<Socket> = this.connections.get(user.id);
            if (sockets) {
                sockets.delete(socket);
                if (sockets.size === 0) {
                    await this.userService.updateUserStatus(Number(user.id), Status.LOGOUT);
                    this.connections.delete(user.id);
                } else {
                    this.connections[user.id] = sockets;
                }
            }
            return ;
        } catch {
            socket.disconnect();
            throw new WsException('the user cannot connect');
        }
    }
}