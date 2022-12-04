import { PickType, OmitType, ApiProperty } from '@nestjs/swagger';
import { ChatMember } from 'src/typeorm';
export class UpdateMemberDto extends PickType(ChatMember, []) {
  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Target user id',
  })
  targetUserId: number;

  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Block or not',
  })
  block?: boolean;

  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Mute or not',
  })
  mute?: boolean;

  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Kick or not',
  })
  kick?: boolean;

  //   @ApiProperty({
  //     required: false,
  //     type: 'boolean',
  //     description: 'Set target user admin or not',
  //   })
  //   admin?: boolean;
}
