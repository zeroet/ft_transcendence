import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { ConnectionService } from 'src/connection/connection.service';
import { UsersModule } from 'src/users/users.module';
import { GameEvents } from './game.Events';
import { RoomService } from './room.service';

@Module({
  imports: [PassportModule, UsersModule, JwtModule, AuthModule],
  providers: [GameEvents, JwtAccessStrategy, RoomService, ConnectionService],
})
export class GameModule {}
