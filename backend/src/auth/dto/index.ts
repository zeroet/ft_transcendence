import { TwoFactorActivatedDto } from './twofactorActivated.dto';
import { TwoFactorCodeDto } from './twofactorCode.dto';
import { TwoFactorValidDto } from './twofactorValid.dto';

export const authDtos = [
  TwoFactorCodeDto,
  TwoFactorValidDto,
  TwoFactorActivatedDto,
];

export { TwoFactorCodeDto, TwoFactorValidDto, TwoFactorActivatedDto };
