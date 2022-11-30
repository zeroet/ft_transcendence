
export interface GameDTO{
    Players: Array<any>[];
    roomName: string;
    ownerId: string;
    speed: string;
    ballSize: string;
}

export class Game{
    game: GameDTO;

    constructor(user1, user2) {
        this.game.Players.push(user1);
        this.game.ownerId = user1;
        this.game.Players.push(user2);
    }
}