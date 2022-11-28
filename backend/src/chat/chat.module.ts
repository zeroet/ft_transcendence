import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { EventsGateway } from 'src/evants/events.gateway';
import { EventsModule } from 'src/evants/events.module';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatroomController } from './controllors/chatroom/chatroom.controller';
import { DmController } from './controllors/dm/dm.controller';
import { ChatrommService } from './services/chatromm/chatromm.service';
import { DmService } from './services/dm/dm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chatroom, ChatMember, ChatContent]),
    // EventsModule,
    UsersModule,
  ],
  controllers: [DmController, ChatroomController],
  providers: [
    { provide: 'DM_SERVICE', useClass: DmService },
    { provide: 'CHATROOM_SERVICE', useClass: ChatrommService },
    EventsGateway,
    JwtAccessStrategy,
  ],
})
export class ChatModule {}
