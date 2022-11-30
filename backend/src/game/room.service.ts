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
        console.log(user.username);
        return true;
    }

    isFull() {
        if (this.size === 2)
            return true;
        return false;
    }

    readyQueue() {
        const owner = this.Players[0];
        const player = this.Players[1];
        owner.emit('createRoom', { isOwner: true });
        player.emit('createRoom', { isOwner: false });
    }
    
    isOwner(client: Socket)
    {
        if(this.rooms.get(client.data.roomName).Player[0] === client.id)
            return true;
        return false;
    }

    isPlayer(client:Socket, name:string, ready: boolean)
    {
        console.log(`client ${client.id}, name ${name}, ready${ready}`)
        if(this.rooms.get(name).Player[1] === client.id && ready === true) 
            return true;
        return false;
    }

    createRoom(roomName: string) {
        this.Players[0].join(roomName);
        this.Players[0].data.roomName = roomName;
        this.Players[1].join(roomName);
        this.Players[1].data.roomName = roomName;
        

        const room = new Room(this.Players[0].id, this.Players[1].id);
        this.rooms.set(roomName, room);
        this.Players.shift();
        this.Players.shift();
        this.size = 0;

        // const newRoom = this.rooms.get(roomId)
        // console.log(newRoom.Player[0].id);
        return ;
    }
}