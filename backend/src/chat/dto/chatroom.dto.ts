import { ApiProperty } from '@nestjs/swagger';

export class ChatroomDto {
  @ApiProperty({
    type: 'number',
    description: 'chatroom id',
  })
  chatroomId: number;

  @ApiProperty({
    type: 'number',
    description: 'owner id',
  })
  ownerId: number;

  @ApiProperty({
    type: 'string',
    description: 'chatroom name',
  })
  chatroomName: string;

  @ApiProperty({
    type: 'string',
    description: 'password',
  })
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'created time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    description: 'modified time',
  })
  modifedAt: Date;
}
