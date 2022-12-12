import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { Block, Friend, MatchHistory, User } from 'src/typeorm';
import { ProfileController } from './controllers/profile/profile.controller';
import { UsersController } from './controllers/users/users.controller';
import { ProfileService } from './services/profile/profile.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Block, Friend, MatchHistory]),
    JwtModule.register({}),
    PassportModule,
    EventsModule,
  ],
  controllers: [UsersController, ProfileController],
  providers: [
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    ProfileService,
  ],
  exports: [
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
  ],
})
export class UsersModule {}
