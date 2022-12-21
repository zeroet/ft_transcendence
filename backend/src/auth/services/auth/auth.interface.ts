import { CookieOptions } from 'express';

export interface IAuthService {
  defaultCookieOptions: CookieOptions;
  accessTokenCookieOptions: CookieOptions;
  refreshTokenCookieOptions: CookieOptions;
  getAccessToken(id: number, twoFactorActivated: boolean): string;
  getRefreshToken(id: number): string;
  setRefreshToken(id: number, refreshToken: string): void;
  verify(accessToken: any);
}
