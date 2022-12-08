import { ApiProperty } from '@nestjs/swagger';

export class ChangeAdminDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  targetUserId: number;
}
