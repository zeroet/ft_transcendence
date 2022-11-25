import { Module } from '@nestjs/common';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatrommService } from './services/chatromm/chatromm.service';
import { DmService } from './services/dm/dm.service';

@Module({
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatrommService },
  ],
})
export class ChatModule {}
