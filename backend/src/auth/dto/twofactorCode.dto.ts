import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorCodeDto {
  @ApiProperty({
    type: 'string',
    description: '6 digits code for 2FA',
  })
  @IsNotEmpty()
  @IsString()
  two_factor_code: string;
}
