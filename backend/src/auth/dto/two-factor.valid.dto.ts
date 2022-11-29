import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TwoFactorValidDto {
  @ApiProperty({
    type: 'boolean',
    description: 'true or false',
  })
  @IsNotEmpty()
  @IsBoolean()
  two_factor_valid: boolean;
}
