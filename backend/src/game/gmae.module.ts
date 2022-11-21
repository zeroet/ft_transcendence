import { Module } from "@nestjs/common";
import { GameEvents } from "./game.Events";

@Module({
    providers: [GameEvents]
})

export class GameModule {}