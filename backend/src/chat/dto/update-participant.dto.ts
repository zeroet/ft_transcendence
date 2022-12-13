import { PickType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ChatMember } from 'src/typeorm';
export class UpdateParticipantDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    // required: false,
    type: Boolean,
    description: 'Mute or not',
  })
  @IsBoolean()
  @IsOptional()
  mute: boolean;
}
