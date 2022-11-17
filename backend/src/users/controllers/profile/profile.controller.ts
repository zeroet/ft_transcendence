import { Body, Controller, Post, UseGuards, Request, Inject, BadRequestException, UnauthorizedException} from "@nestjs/common";
import { JwtAccessAuthGuard } from "src/auth/guards/jwt.access-auth.guard";
import { AuthService } from "src/auth/services/auth/auth.service";
import { JwtAccessStrategy } from "src/auth/strategies/jwt.access.strategy";
import { User } from "src/typeorm";
import { ProfileService } from "src/users/services/profile/profile.service";

@Controller('setting')
export class ProfileController {
    constructor (
        private readonly profileService: ProfileService) 
        {}

    // @UseGuards(JwtAccessAuthGuard)
    // 저거 원래 1 대신에 @Request() req.user.id 해서 들어가야하는데 그렇게 하면 access어쩌고 에러뜸 ㅠ
    @Post('/username')
    async changeUsername(@Body() newUserName:string){
        if (newUserName.length > 30) throw new BadRequestException('Username is tool long (max 30)');
        await this.profileService.updateUserName(1, newUserName);
    }
}