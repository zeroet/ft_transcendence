import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './test/User';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
