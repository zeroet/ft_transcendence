import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { FtStrategy } from './strategies/ft.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategies/jwt.access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt.refresh.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    UsersModule,
    JwtModule.register({}),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    FtStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
