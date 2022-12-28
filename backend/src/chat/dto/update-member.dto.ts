import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
export class UpdateMemberDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    type: Boolean,
    description: 'Kick or not',
  })
  @IsBoolean()
  @IsOptional()
  kick: boolean;
}
