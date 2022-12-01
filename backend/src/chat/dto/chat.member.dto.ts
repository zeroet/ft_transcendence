import { PickType } from '@nestjs/swagger';
import { ChatMember } from 'src/typeorm';
export class ChatMemberDto extends PickType(ChatMember, ['User']) {}
