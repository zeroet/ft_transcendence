import { Controller, Get, Inject, Param, UseGuards } from "@nestjs/common";
import { JwtAccessAuthGuard } from "src/auth/guards/jwt.access-auth.guard";
import { IAuthService } from "src/auth/services/auth/auth.interface";
import { MatchHistory } from "src/typeorm";
import { UserService } from "src/users/services/user/user.service";


@Controller('game')
@UseGuards(JwtAccessAuthGuard)
export class GameController {
    constructor(
        @Inject('USER_SERVICE') private userService: UserService
    ) {}

}