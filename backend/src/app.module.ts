import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './test/User';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password: "",
    database: "test",
    synchronize: true,
    entities: [User],

  })],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
