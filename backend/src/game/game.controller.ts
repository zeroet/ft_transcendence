import { Controller, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';

@Controller('game')
@UseGuards(JwtAccessAuthGuard)
export class GameController {
  constructor() {}
}
