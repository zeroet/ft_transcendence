import { Status, UserDetails } from 'src/utils/types';

export interface IAuthService {
  defaultCookieOptions;
  accessTokenCookieOptions;
  refreshTokenCookieOptions;
  getAccessToken(id: number, twoFactorActivated: boolean);
  getRefreshToken(id: number);
  setRefreshToken(id: number, refreshToken: string);
  verify(accessToken: any);
}
