import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  defaultCookieOptions;
  accessTokenCookieOptions;
  refreshTokenCookieOptions;
  validateUser(userDetails: UserDetails);
  createUser(userDetails: UserDetails);
  getTokens(id: number);
  getAccessToken(id: number);
  getAccessToken(id: number);
  setRefreshToken(id: number, refreshToken: string);
}
