import { Module} from "@nestjs/common";
import { GameContorller } from "./controller/game.controller";
import { GameEvents } from "./game.Events";

@Module({
    providers: [GameEvents]
})

export class GameModule {}