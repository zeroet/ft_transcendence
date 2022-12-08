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
import { TwoFactorContorller } from './controllers/two-factor/two-factor.controller';
import { TwoFactorService } from './services/two-factor/two-factor.service';
import { JwtTwoFactorStrategy } from './strategies/jwt.two-factor.strategy';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    UsersModule,
    JwtModule.register({}),
    PassportModule,
    EventsModule,
  ],
  controllers: [AuthController, TwoFactorContorller],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    { provide: 'TWO_FACTOR_SERVICE', useClass: TwoFactorService },
    FtStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtTwoFactorStrategy,
  ],
  exports: [{ provide: 'AUTH_SERVICE', useClass: AuthService }],
})
export class AuthModule {}
