import { Body, Controller, Post, UseGuards, Request} from "@nestjs/common";
import { JwtAccessAuthGuard } from "src/auth/guards/jwt.access-auth.guard";
import { User } from "src/typeorm";
import { ProfileService } from "src/users/services/profile/profile.service";

@Controller('setting')
export class ProfileController {
    private readonly profileService: ProfileService

    @UseGuards(JwtAccessAuthGuard)
    @Post('username')
    async changeUsername(@Request() req, @Body() username:string): Promise<any>{
        return await this.profileService.changname(req.user.id, username);
    }
}