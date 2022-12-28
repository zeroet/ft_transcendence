import { Module } from '@nestjs/common';
import { ChatEventsGateway } from './chat.events.gateway';

@Module({
  imports: [],
  providers: [ChatEventsGateway],
  exports: [ChatEventsGateway],
})
export class EventsModule {}
