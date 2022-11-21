import { Module } from '@nestjs/common';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';

@Module({
  controllers: [DmController, ChatroomController],
  providers: [],
})
export class ChatModule {}
