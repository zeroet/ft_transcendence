import { RoomService } from "../room.service";
import { Socket } from "socket.io"

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

export enum Status {
    READY,
    PLAY,
    END,
}


export class GameService{
 
   private roomService: RoomService
    
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
    
    constructor(Player1, Player2, Status:Status, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.Status = Status;
        this.Players.push(Player1);
        this.Players.push(Player2);
        this.Watchers = [];
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.speed = Number(speed);
        this.width = 1450;
        this.height = 725;
        this.ballSize = Number(ballSize);
        this.name = {name1:'', name2:''};
        this.ball = {x: this.width/2, y:this.height/2};
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
      
    update() {
        if (this.Players.length != 2) {
            this.Status = Status.END;
            this.default()
            // 'gameover' emit data{x}
            console.log('GAME END')
        }
        var nextX = this.ball.x + this.dir.dx;
        var nextY = this.ball.y + this.dir.dy;

        if (nextY <= 725 || nextY >= 0) {
            if (nextY <= 725) {
              this.dir.dy *= -1;
              nextY += 1;
            }
            if (nextY >= 10) {
              this.dir.dy *= -1;
              nextY -= 1;
            }
        }
        this.ball.x = nextX += this.dir.dx * 0.2 *this.speed/2;
        this.ball.y = nextY += this.dir.dy * 0.3 *this.speed/2;
        if ((this.ball.x - this.ballSize) >= 1450 || (this.ball.x + this.ballSize) <= 10)
        {
            this.ball.x >= 1450 ? this.score.player2 += 1 : this.score.player1 += 1;
            console.log(`${this.score.player1} : ${this.score.player2}`)
            if (this.score.player1 == 10) {
                console.log('player1 win !')
                //'gameover : data { player1: name }'
                // db
                this.Status = Status.END
            }
            else if (this.score.player2 == 10) {
                console.log('player2 win !')
                //'gameover : data { player2: name }'
                // db 
                this.Status = Status.END
            }
            this.default()
        }
        return this.ball;
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

    pushWatcher(watcher: Socket)
    {
        this.Watchers.push(watcher);
    }
}