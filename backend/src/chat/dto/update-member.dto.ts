import { PickType, OmitType, ApiProperty } from '@nestjs/swagger';
import { ChatMember } from 'src/typeorm';
export class UpdateMemberDto extends PickType(ChatMember, []) {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  targetUserId: number;

  //   @ApiProperty({
  //     required: false,
  //     type: Boolean,
  //     description: 'Block or not',
  //   })
  //   block?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Ban or not',
  })
  ban?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Kick or not',
  })
  kick?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Mute or not',
  })
  mute?: boolean;

  //   @ApiProperty({
  //     required: false,
  //     type: 'boolean',
  //     description: 'Set target user admin or not',
  //   })
  //   admin?: boolean;
}
