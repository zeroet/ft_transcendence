import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Chatroom } from 'src/typeorm';

export class CreateChatroomDto extends PickType(Chatroom, [
  'chatroomName',
  'password',
]) {
  @ApiProperty({
    type: String,
    example: 'wanna chat with me ?',
    description: 'chatroom name',
  })
  @IsString()
  chatroomName: string;

  @ApiProperty({
    type: String,
    example: 'come talk to me',
    description: 'password',
  })
  @IsString()
  @IsOptional()
  password: string | null;
}
