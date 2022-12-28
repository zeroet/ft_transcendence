import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import {
  Block,
  ChatContent,
  ChatMember,
  ChatParticipant,
  Chatroom,
  Dm,
  User,
} from 'src/typeorm';
import { DmContent } from 'src/typeorm/entities/dmContent.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatroomService } from './services/chatroom/chatroom.service';
import { DmService } from './services/dm/dm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Block,
      Chatroom,
      ChatMember,
      ChatParticipant,
      ChatContent,
      Dm,
      DmContent,
    ]),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    EventsModule,
  ],
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatroomService },
  ],
})
export class ChatModule {}
