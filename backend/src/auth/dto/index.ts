import { TwoFactorActivatedDto } from './two-factor.activated.dto';
import { TwoFactorCodeDto } from './two-factor.code.dto';
import { TwoFactorValidDto } from './two-factor.valid.dto';

export const authDtos = [
  TwoFactorCodeDto,
  TwoFactorValidDto,
  TwoFactorActivatedDto,
];

export { TwoFactorCodeDto, TwoFactorValidDto, TwoFactorActivatedDto };
