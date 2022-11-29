export class RoomName{
    name: string;
    speed : string;
    ballSize : string;
}

export class Room {
    Player = []

    constructor(user1, user2){
        this.Player.push(user1);
        this.Player.push(user2);
    }
}