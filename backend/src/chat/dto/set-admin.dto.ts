import { ApiProperty } from '@nestjs/swagger';

export class SetAdminDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  targetUserId: number;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: 'true or false to set the target user as admin',
  })
  isAdmin: boolean;
}
