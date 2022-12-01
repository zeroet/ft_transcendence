import { Injectable } from '@nestjs/common';
import { Game } from './interfaces/room';
import { Socket } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'http';

@Injectable()
export class roomService{
    
    // size: number = 0;
    // Players: Array<any> = [];
    // rooms: Map<string, Game> = new Map();

    // addUser(user) {
    //     for (const socket of this.Players)
    //         if (socket === user) return false;
    //     this.Players.push(user);
    //     this.size += 1;
    //     console.log(user.username);
    //     return true;
    // }

    // isFull() {
    //     if (this.size === 2)
    //         return true;
    //     return false;
    // }

    // readyQueue() {
    //     const owner = this.Players[0];
    //     const player = this.Players[1];
    //     owner.emit('createRoom', { isOwner: true });
    //     player.emit('createRoom', { isOwner: false });
    // }
    
    // isOwner(client: Socket)
    // {
    //     if(this.rooms.get(client.data.roomName).Players[0] === client.id)
    //         return true;
    //     return false;
    // }

    // isPlayer(client:Socket, name:string, ready: boolean)
    // {
    //     console.log(`client ${client.id}, name ${name}, ready${ready}`)
    //     if(this.rooms.get(name).Players[1] === client.id && ready === true) 
    //         return true;
    //     return false;
    // }

    // createRoom(roomName: string) : any {
    //     this.Players[0].join(roomName);
    //     this.Players[1].join(roomName);
        

    //     const game = new Game(this.Players[0], this.Players[1]);
    //     game.roomName = roomName;
        
    //     this.rooms.set(roomName, game);
    //     this.Players.shift();
    //     this.Players.shift();
    //     this.size = 0;

    //     // const newRoom = this.rooms.get(roomId)
    //     // console.log(newRoom.Player[0].id);
    //     return game
    // }
}