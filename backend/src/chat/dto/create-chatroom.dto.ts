import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatroomDto {
  @ApiProperty({
    type: 'string',
    description: 'chatroom name',
  })
  @IsString()
  chatroom_name: string;

  @ApiProperty({
    type: 'string',
    description: 'password',
  })
  @IsString()
  password: string;
}
