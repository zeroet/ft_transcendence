import { PickType, OmitType, ApiProperty } from '@nestjs/swagger';
import { Chatroom } from 'src/typeorm';
export class UpdateChatroomDto extends PickType(Chatroom, [
  'chatroomName',
  'password',
]) {}
