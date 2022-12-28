import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTestUserDto {
  @ApiProperty({
    type: String,
    example: 'string',
    description: 'Test user name',
  })
  @IsString()
  name: string;
}
