import { Injectable, Inject } from "@nestjs/common";
import { Socket } from "socket.io";
import { Repository } from 'typeorm';
import { GameService } from './interfaces/room'
import { Stat } from './interfaces/room'
import { Interval } from "@nestjs/schedule";
import { GameEvents } from "./game.Events";
import { UserService } from "src/users/services/user/user.service";
import { MatchHistory, User } from "src/typeorm";
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from "src/auth/services/auth/auth.service";
import { emit } from "process";


@Injectable()
export class RoomService{
    constructor(
        @Inject('USER_SERVICE') private userService : UserService,
        @InjectRepository(MatchHistory) 
        private matchHistoryRepository : Repository<MatchHistory>,       
    ) {}

    rooms: Map<string, GameService> = new Map();

    createRoom (player1: Socket, player2:Socket) {
        this.userService.getMatch(1);
        player1.emit('createRoom', { isOwner: true } );
        player2.emit('createRoom', { isOwner: false });
    }

    startGame(user1, user2, player1: Socket, player2: Socket, Status: Stat, roomName:string, owner:string, speed:string, ballsize:string)
    {
        const game = new GameService(user1, user2, player1, player2, Status, roomName, owner, speed, ballsize)
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
        if (room.Status == Stat.PLAY) 
        {
            const res = room.update();
            for(const player of room.Players)
                player.emit('info', res)
            for(const watcher of room.Watchers) {
                watcher.emit('info', res)
            }
            // console.log(`${res.x}, ${res.y}, ${res.score1}, ${res.score2}`)
        }
        else if (room.Status == Stat.END) {
         this.gameOver(room.Players, room.score, room.user1, room.user2)
         this.rooms.delete(room.roomName);
        }
        else if (room.Status == Stat.CANCEL)
        {
            for(const player of room.Players)
                player.emit('gamecancel')
            for (const watcher of room.Watchers)
                watcher.emit('gamecancel')
            this.rooms.delete(room.roomName)
        }
    }

    addWatcher(watcher: Socket, roomName:string){

        for (const room of this.rooms.values())
            if (room.isPlayer(watcher)) return ;
        for(const room of this.rooms.values())
        {
            if (room.roomName === roomName) {
                // watcher.join(roomName);
                room.pushWatcher(watcher);
            }
        }
    }

    addName(player, name){
        for(const room of this.rooms.values()) {
            if (room.isPlayer(player))
            {
                if(room.isOwner(player)) 
                    room.addName1(name)
                else if(room.isPlayer2(player))
                    room.addName2(name)
            }
        }
    }


    async gameOver(Players, Score, user1:User, user2:User) {
        if (Players.length == 2)
        {
            if (Score.player1 > Score.player2)
            {    
                const winner = user1
                const loser = user2
                const score = [Score.player1, Score.player2]
<<<<<<< HEAD
                await this.userService.createMatchHistory({winner, loser, score});
=======
                console.log(winner, loser, score)
                // const match: MatchHistory = await this.matchHistoryRepository.create({
                //     score, winner, loser} as MatchHistory);
                // await this.matchHistoryRepository.save(match);
                
>>>>>>> a0b7fe521c6d2909702b3ea5a0d311037b382327
            }
            else if (Score.player2 > Score.player1)
            {
                const winner = user2
                const loser = user1
                const score = [Score.player1, Score.player2]
<<<<<<< HEAD
                await this.userService.createMatchHistory({winner, loser, score}) 
=======
                console.log(winner, loser, score)
                
                // const match: MatchHistory = await this.matchHistoryRepository.create({
                //  score, winner, loser} as MatchHistory);
                // await this.matchHistoryRepository.save(match);
            }    
>>>>>>> a0b7fe521c6d2909702b3ea5a0d311037b382327
        }
        for(const player of Players)
            player.emit('gameover');
        }
    }
    
    //watcher event  Front
    gameOverWatcher(Watchers)
    {
        for(const watchers of Watchers)
        watchers.emit('gameover');
    }

    movePaddle(player:Socket, data:number){
        for (const room of this.rooms.values())
        {
            if (room.isOwner(player)) {
                room.keyPaddle1(data);
            }
            else if (room.isPlayer2(player)){
                room.keyPaddle2(data);
            }
        }
    }

    watcherOut(watcher:Socket) {
        for (const room of this.rooms.values())
        {
            if (room.isWatcher(watcher)) {
                room.deleteWatcher(watcher);
                return true;
            }
        }
        return false;
    }

    findRoom(roomName:string){
        for (const room of this.rooms.values())
            if (room.roomName === roomName)
                return room;
        return ;
    }

}
