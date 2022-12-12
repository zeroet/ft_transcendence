import { PickType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ChatMember } from 'src/typeorm';
export class UpdateMemberDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  @IsNumber()
  targetUserId: number;

  // @ApiProperty({
  //   required: false,
  //   type: Boolean,
  //   description: 'Ban or not',
  // })
  // ban?: boolean;

  @ApiProperty({
    // required: false,
    type: Boolean,
    description: 'Kick or not',
  })
  @IsBoolean()
  @IsOptional()
  kick: boolean;

  @ApiProperty({
    // required: false,
    type: Boolean,
    description: 'Mute or not',
  })
  @IsBoolean()
  @IsOptional()
  mute: boolean;
}
