import { ApiProperty } from '@nestjs/swagger';

export class ChangeOwnerDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Target user id',
  })
  targetUserId: number;
}
