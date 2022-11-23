import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class profileDTO {
  @ApiProperty({
    type: 'string',
    description: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'image URL',
  })
  @IsString()
  image_url: string;
}
