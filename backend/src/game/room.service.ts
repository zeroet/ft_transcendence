import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameService } from './interfaces/room'
import { Status } from './interfaces/room'
import { Interval } from "@nestjs/schedule";

@Injectable()
export class RoomService{
        constructor(
        ) {}

    rooms: Map<string, GameService> = new Map();

    createRoom (player1: Socket, player2:Socket) {
        player1.emit('createRoom', { isOwner: true } );
        player2.emit('createRoom', { isOwner: false });
    }

    startGame(player1: Socket, player2: Socket, Status: Status, roomName:string, owner:string, speed:string, ballsize:string)
    {
        const game = new GameService(player1, player2, Status, roomName, owner, speed, ballsize)
        this.rooms.set(roomName, game);
    }

    roomList() : Array<string> {
        const list = [];
        for (const room of this.rooms.keys())
            list.push(room);
        return list;
    }

    @Interval(1000 / 60)
    loop(): void {
      for (const room of this.rooms.values())
        if (room.Status == Status.PLAY) 
        {
            const ball = room.update();
            for(const player of room.Players)
                player.emit('ball', ball)
            for(const watcher of room.Watchers) {
                watcher.emit('ball', ball)
            }
        }
    }

    addWatcher(watcher: Socket, roomName:string){

        for (const room of this.rooms.values())
            if (room.isPlayer(watcher)) return ;
        for(const room of this.rooms.values())
        {
            if (room.roomName === roomName) {
                watcher.join(roomName);
                room.pushWatcher(watcher);
            }
        }
    }

    addName(player, name){
        for(const room of this.rooms.values())
            if (room.isPlayer == player)
            {
                if(room.isOwner(player))
                    room.name.name1 = name;
                if (room.isPlayer(player))
                    room.name.name2 = name;
            }
    }
}
