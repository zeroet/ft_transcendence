import { Injectable } from "@nestjs/common";
import { RoomService } from "../room.service";

type ball = {
    x: number;
    y: number;
}

type dir = {
    dx: number;
    dy: number;
}

type score = {
    player1: number;
    player2: number;
}

export enum Status {
    READY,
    PLAY,
    END,
}

@Injectable()
export class Game{
 
   private roomService: RoomService
    
    Status: Status;
    Players = [];
    Watchers: Array<any>;
    roomName: string;
    ownerId: string;
    speed: number;
    ballSize: number;
    ball: ball;
    score: score;
    dir : dir
    width: number;
    height: number;
    
    constructor(Player1, Player2, Status:Status, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.Status = Status;
        this.Players.push(Player1);
        this.Players.push(Player2);
        this.Watchers = [];
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.speed = Number(speed);
        this.width = 1375;
        this.height = 725;
        this.ballSize = Number(ballSize);
     
        this.ball = {x:0, y:0};
        this.dir = {dx:1, dy:1};
        this.score = {
            player1: 0, player2: 0
        };
    }
    default() {
        this.ball.x = Math.random()*(this.width/5) + (2*this.width/5);
        this.ball.y = Math.random()*(this.height/2) + (this.height/4);
        this.dir.dx = Math.random() > 0.5 ? -1 : 1;
        this.dir.dy = Math.random() > 0.5 ? -1 : 1;
    }
    // set = function(newX, newY){
        //     this.x = newX;
        //     this.y = newY;
    // };
      
    // setD = function(_dx, _dy){
    //     this.dx = _dx;
    //     this.dy = _dy;
    // };
      
    // randomDirection = function(){
    //     this.dx = Math.random() > 0.5 ? -1 : 1;
    //     this.dy = Math.random() > 0.5 ? -1 : 1;
    // };
      
    update() {
        this.default()
        var nextX = this.ball.x + this.dir.dx;
        var nextY = this.ball.y + this.dir.dy;
        if(nextX < this.ballSize || nextX > this.width - this.ballSize){
          this.dir.dx *= -1;
        }
        if(nextY < this.ballSize || nextY > this.height - this.ballSize){
          this.dir.dy *= -1;
        }
        this.ball.x += this.dir.dx * this.speed/100;
        this.ball.y += this.dir.dy * this.speed/100;
        for(const user of this.Players) {
            user.emit('ball', this.ball)
            console.log(`this ${user.id} this x ${this.ball.x} this y ${this.ball.y}`)
        }
    };


    isPlayer(user:any) {
        if(this.Players.indexOf(user) != -1)
            return true;
        else    
            return false
    }

    isOwner(user:any){
        if (user.id === this.Players[0].id)
            return true;
        else   
            return false;
    }

    isPlayer2(user: any){
        if (user.id === this.Players[1].id)
            return true
        else
            return false;
    }

    deletePlayer(user :any) {
        if (this.Players.splice(this.Players.indexOf(user), 1))
            return true;
        else
            return false;
    }

    changeStatus(status :Status)
    {
        this.Status = status;
    }
}