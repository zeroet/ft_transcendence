import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { FtStrategy } from './strategies/ft.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, FtStrategy],
})
export class AuthModule {}
