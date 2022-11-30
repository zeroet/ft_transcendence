
export class Game{

    Players: Array<any>;
    roomName: string;
    ownerId: string;
    speed: string;
    ballSize: string;
    
    constructor(Players:Array<any>, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.Players = Players;
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.speed = speed;
        this.ballSize = ballSize;
    }
}