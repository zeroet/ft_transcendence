import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatrommService } from './services/chatromm/chatromm.service';
import { DmService } from './services/dm/dm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chatroom, ChatMember, ChatContent]),
    UsersModule,
  ],
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatrommService },
    ChatEventsGateway,
    JwtAccessStrategy,
  ],
})
export class ChatModule {}
