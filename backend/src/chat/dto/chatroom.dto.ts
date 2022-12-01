import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Chatroom } from 'src/typeorm';

export class ChatroomDto extends OmitType(Chatroom, [
  'password',
  'createdAt',
  'modifiedAt',
]) {
  @ApiProperty({
    type: Boolean,
    description: 'private or public',
  })
  isPrivate: boolean;
  // chatroomId: number;
  // ownerId: number;
  // chatroomName: string;
  // password: string;
  // createdAt: Date;
  // modifedAt: Date;
}
