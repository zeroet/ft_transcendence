import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from 'src/typeorm';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatrommService } from './services/chatromm/chatromm.service';
import { DmService } from './services/dm/dm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom])],
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatrommService },
  ],
})
export class ChatModule {}
