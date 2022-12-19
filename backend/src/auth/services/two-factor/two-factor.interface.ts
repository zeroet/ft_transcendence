import { IUser } from 'src/typeorm/interfaces/IUser';

export interface ITwoFactorService {
  generateTwoFactorSecret(user: IUser);
  pipeQrCodeStream(stream: Response, otpAuthUrl: string);
  validateTwoFactorCode(two_factor_secret: string, two_factor_code: string);
  setTwoFactorActivated(id: number, two_factor_activated: boolean);
  setTwoFactorSecret(id: number, secret: string);
  setTwoFactorValid(id: number, two_factor_valid: boolean);
}
