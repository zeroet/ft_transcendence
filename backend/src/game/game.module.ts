import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { ConnectionService } from 'src/connection/connection.service';
import { User, Block, Friend, MatchHistory } from 'src/typeorm';
import { UserService } from 'src/users/services/user/user.service';
import { UsersModule } from 'src/users/users.module';
import { GameEvents } from './game.Events';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { GameController } from './game.controller';

 
@Module({
  imports: [PassportModule, UsersModule, JwtModule, AuthModule,
    EventsModule,
    TypeOrmModule.forFeature([
    User,
    Block,
    Friend,
    MatchHistory
  ])],
  controllers: [GameController],
  providers: [GameEvents, JwtAccessStrategy, RoomService, ConnectionService, UserService],
})
export class GameModule {}
