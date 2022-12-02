import { PickType, OmitType } from '@nestjs/swagger';
import { ChatContent } from 'src/typeorm';
export class ChatContentDto extends OmitType(ChatContent, [
  'Chatroom',
  'User',
]) {}
