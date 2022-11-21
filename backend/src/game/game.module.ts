import { Module} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "src/auth/auth.module";
import { JwtAccessStrategy } from "src/auth/strategies/jwt.access.strategy";
import { UserService } from "src/users/services/user/user.service";
import { UsersModule } from "src/users/users.module";
import { GameEvents } from "./game.Events";

@Module({
    imports: [PassportModule, UsersModule, JwtModule],
    providers: [GameEvents, JwtAccessStrategy]
})

export class GameModule {}