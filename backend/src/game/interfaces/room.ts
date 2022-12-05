import { Socket } from 'socket.io';

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
    Players: Array<any>;
    Watchers: Array<any>;
    roomName: string;
    ownerId: string;
    speed: string;
    ballSize: string;
    ball: ball;
    score: score;
    
    constructor(Players:Array<any>, Status:Status, roomName:string, ownerId:string, speed:string, ballSize:string) {
        this.Status = Status;
        this.Players = Players;
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
}