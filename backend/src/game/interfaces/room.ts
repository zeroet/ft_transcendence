import { RoomService } from "../room.service";
import { Socket } from "socket.io"
import { Inject } from "@nestjs/common";

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

type name = {
    name1: string;
    name2: string;
}

type paddles = {
    paddle1: number;
    paddle2: number;
}

type wall = {
    width:number;
    height:number;
}

export enum Status {
    READY,
    PLAY,
    END,
}


export class GameService{
    @Inject() roomService: RoomService

    Status: Status;
    Players = [];
    name : name;
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
    paddles: paddles;
    wall: wall;

    constructor(Player1, Player2, Status:Status, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.roomService = new RoomService()
        this.Status = Status;
        this.Players.push(Player1);
        this.Players.push(Player2);
        this.Watchers = [];
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.speed = Number(speed);
        this.width = 1475;
        this.height = 725;
        this.ballSize = Number(ballSize);
        this.name = {name1:"", name2:""};
        this.ball = {x: this.width/2, y:this.height/2};
        this.dir = {dx:1, dy:1};
        this.score = {
            player1: 0, player2: 0
        };
        this.wall = {height:100, width:10}
        this.paddles = {paddle1: 0, paddle2: 0}
    }
    
    default() {
        this.ball.x = Math.random()*(this.width/5) + (2*this.width/5);
        this.ball.y = Math.random()*(this.height/2) + (this.height/4);
        this.dir.dx = Math.random() > 0.5 ? -1 : 1;
        this.dir.dy = Math.random() > 0.5 ? -1 : 1;
    }

    gameover() {
        this.Status = Status.END;
        this.roomService.gameOver(this.Players)
    }

    // inGameOver() {
    //     this.roomService.gameOver(this.Players)
    // }

      
    update() {
        //player out  over case
        if (this.Players.length != 2) {
            this.Status = Status.END;
            this.gameover()
        }

        
        var nextX = this.ball.x + this.dir.dx;
        var nextY = this.ball.y + this.dir.dy;
        
        //top bottom dir change
        if (nextY <= 725 || nextY >= 0) {
            if (nextY <= 725) {
                this.dir.dy *= -1;
                nextY += 1;
            }
            if (nextY >= 0) {
                this.dir.dy *= -1;
                nextY -= 1;
            }
        }
        
        // new x y
        this.ball.x = nextX += this.dir.dx * 0.2 *this.speed/2;
        this.ball.y = nextY += this.dir.dy * 0.3 *this.speed/2;
        // paddles

        // if ((this.ball.x + this.ballSize + 30) >= 1375)
        // {
        //     if (100 < this.ball.y + this.ballSize + 1 && this.ball.y - this.ballSize - 1 < 500)
        //     {
        //         this.dir.dx *= -1;
        //         nextX -= 10;
        //     }
        // }
        // else if ((this.ball.x - this.ballSize - 30) <= 0)
        // {
        //     if (100 < this.ball.y + this.ballSize + 1 && this.ball.y - this.ballSize - 1 < 500)
        //     {
        //         this.dir.dx *= -1;
        //         nextX += 10;
        //     }
        // }

        // score 
        if ((this.ball.x - this.ballSize) >= 1475 || (this.ball.x + this.ballSize) <= 0)
        {
            console.log(`${this.ball.x}, ${this.ballSize}`);
            this.ball.x >= 1475 ? this.score.player1 += 1 : this.score.player2 += 1;
            console.log(`${this.score.player1} : ${this.score.player2}`)
            if (this.score.player1 == 10) {
                this.gameover()
                // db
            }
            else if (this.score.player2 == 10) {
                this.gameover()
                // db 
                this.Status = Status.END
            }
            this.default()
        }

        //return 
        return ({
            x:this.ball.x,
            y:this.ball.y,
            name1:this.name.name1,
            name2:this.name.name2,
            score1:this.score.player1,
            score2:this.score.player2,
            paddle1:this.paddles.paddle1,
            paddle2:this.paddles.paddle2,
            ballsize: this.ballSize
        })
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

    addName1(name)
    {
        this.name.name1 = name;
    }

    addName2(name)
    {
        this.name.name2 = name;
    }

    keyPaddle1(input:number){
        if (input === 1)
        {
            if (this.paddles.paddle1 - 25  < 10)
                return ;
            this.paddles.paddle1 -= 25;
        }
        else if (input === 2)
        {
            if (this.paddles.paddle1 + 25  > 725)
                return ;
            this.paddles.paddle1 += 25;
        }
    }

    keyPaddle2(input:number) {
        if (input === 1)
        {
            if (this.paddles.paddle2 -25 < 10)
                return ;
            this.paddles.paddle2 -= 25;
        }
        else if (input === 2)
        {
            if (this.paddles.paddle2 + 25 > 725)
                return ;
            this.paddles.paddle2 += 25;
        }
    }

    pushWatcher(watcher: Socket)
    {
        this.Watchers.push(watcher);
    }
}