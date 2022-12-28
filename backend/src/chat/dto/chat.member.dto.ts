import { OmitType } from '@nestjs/swagger';
import { ChatMember } from 'src/typeorm';
export class ChatMemberDto extends OmitType(ChatMember, [
  'createdAt',
  'modifiedAt',
]) {}
