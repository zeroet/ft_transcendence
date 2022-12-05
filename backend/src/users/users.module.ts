import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block, Friend, User } from 'src/typeorm';
import { ProfileController } from './controllers/profile/profile.controller';
import { UsersController } from './controllers/users/users.controller';
import { ProfileService } from './services/profile/profile.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Block, Friend]),
    JwtModule.register({}),
    PassportModule,
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
