import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/evants/events.module';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatrommService } from './services/chatromm/chatromm.service';
import { DmService } from './services/dm/dm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chatroom, ChatMember, ChatContent]),
    EventsModule,
  ],
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatrommService },
  ],
})
export class ChatModule {}
