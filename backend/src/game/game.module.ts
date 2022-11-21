import { Module} from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "src/users/services/user/user.service";
import { UsersModule } from "src/users/users.module";
import { GameEvents } from "./game.Events";

@Module({
    imports: [PassportModule, UsersModule],
    providers: [GameEvents]
})

export class GameModule {}