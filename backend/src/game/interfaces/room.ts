
type ball = {
    x: number;
    y: number;
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

export class Game{

    Status: Status;
    Players = [];
    Watchers: Array<any>;
    roomName: string;
    ownerId: string;
    speed: string;
    ballSize: string;
    ball: ball;
    score: score;
    
    constructor(Player1, Player2, Status:Status, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.Status = Status;
        this.Players.push(Player1);
        this.Players.push(Player2);
        this.Watchers = [];
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.speed = speed;
        this.ballSize = ballSize;
        this.score = {
            player1: 0, player2: 0
        };
        this.ball = { x: 50, y: 50 };
    }

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