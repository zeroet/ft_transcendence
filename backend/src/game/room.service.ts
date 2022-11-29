import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService{
    
    size: number;
    Players: Array<any>;
    rooms: Map<string, Room> = new Map();

    addUser(user) {
        if (this.Players.find(user) === user)
            return false;
        this.Players.push(user);
        this.size += 1;
        return true;
    }

    isFull() {
        if (this.size === 2)
            return true;
        return false;
    }

    readyQueue() {
        const player1 = this.Players[0];
        player1.emit('createRoom', { playerId: player1 });
    }
    
    isOwner(client: Socket)
    {
        if(this.Players[0] === client)
            return true;
        return false;
    }

    createRoom(roomId: string) {
        this.Players[0].join(roomId);
        this.Players[1].join(roomId);
        const room = new Room();
        this.rooms.set(roomId, room);
        this.Players.splice(0);
    }
}