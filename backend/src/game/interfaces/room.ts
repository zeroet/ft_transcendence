export class RoomName{
    name: string;
    speed : string;
    ballSize : string;
    ready: boolean;
}

export class Room {
    Player = []

    constructor(user1, user2){
        this.Player.push(user1);
        this.Player.push(user2);
    }
}