import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Chatroom } from 'src/typeorm';

export class CreateChatroomDto extends PickType(Chatroom, [
  'chatroomName',
  'password',
]) {
  @ApiProperty({
    type: 'string',
    description: 'chatroom name',
  })
  @IsString()
  chatroomName: string;

  @ApiProperty({
    type: 'string',
    description: 'password',
  })
  @IsString()
  @IsOptional()
  password: string | null;
}
