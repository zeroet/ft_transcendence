import { Injectable } from "@nestjs/common";

@Injectable()
export class QueueService {
    size: number = 0;
    Players: Array<any> = [];


    addUser(player) {
        for(const socket of this.Players)
            if (socket === player) return false;
        this.Players.push(player);
        this.size += 1;
        console.log(`size!!! ${this.size}, player!!!${player.id}`);
        return true;
    }

    isFull() {
        if (this.size === 2)
            return true;
        return false;
    }

    clear() {
        this.size = 0;
        this.Players.length = 0;
    }
}