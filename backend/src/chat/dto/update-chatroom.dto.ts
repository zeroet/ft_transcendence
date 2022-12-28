import { PickType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Chatroom } from 'src/typeorm';
export class UpdateChatroomDto extends PickType(Chatroom, [
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
