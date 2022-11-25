import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TwoFactorActivatedDto {
  @ApiProperty({
    type: 'boolean',
    description: 'true or false',
  })
  @IsNotEmpty()
  @IsBoolean()
  two_factor_activated: boolean;
}
