import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
export class UpdateParticipantDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    type: Boolean,
    description: 'Mute or not',
  })
  @IsBoolean()
  @IsOptional()
  mute: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Ban or not',
  })
  @IsBoolean()
  @IsOptional()
  ban: boolean;
}
