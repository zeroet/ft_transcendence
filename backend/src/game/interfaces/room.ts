
export class gameInfo{
    Players: Array<any>[];
    roomName: string;
    ownerId: string;
    speed: string;
    ballSize: string;
}

export class Game{
    info: gameInfo;

    constructor(user1, user2) {
        this.info.Players.push(user1);
        this.info.ownerId = user1;
        this.info.Players.push(user2);
    }
}