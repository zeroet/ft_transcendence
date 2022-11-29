import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room';
import { Socket } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'http';

@Injectable()
export class RoomService{
    
    size: number = 0;
    Players: Array<any> = [];
    rooms: Map<string, Room> = new Map();

    addUser(user) {
        for (const socket of this.Players)
            if (socket === user) return false;
        this.Players.push(user);
        this.size += 1;
        console.log(user.data.user);
        return true;
    }

    isFull() {
        if (this.size === 2)
            return true;
        return false;
    }

    readyQueue() {
        const owner = this.Players[0];
        owner.emit('createRoom', {isOwner: true});
    }
    
    isOwner(client: Socket)
    {
        if(this.Players[0].id === client.id)
            return true;
        return false;
    }

    createRoom(roomName: string) {
        this.Players[0].join(roomName);
        this.Players[0].data.roomName = roomName;
        this.Players[1].join(roomName);
        this.Players[1].data.roomName = roomName;


        
        // const room = new Room(this.Players[0], this.Players[1]);
        // this.rooms.set(roomId, room);
        // this.Players.shift();
        // this.Players.shift();
        // this.size = 0;

        // const newRoom = this.rooms.get(roomId)
        // console.log(newRoom.Player[0].id);
        return ;
    }
}