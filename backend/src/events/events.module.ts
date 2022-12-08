import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatEventsGateway } from './chat.events.gateway';

@Module({
  imports: [],
  providers: [ChatEventsGateway],
  exports: [ChatEventsGateway],
})
export class EventsModule {}
