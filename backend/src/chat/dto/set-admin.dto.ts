import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class SetAdminDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: 'true or false to set the target user as admin',
  })
  @IsBoolean()
  isAdmin: boolean;
}
