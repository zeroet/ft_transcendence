import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  defaultCookieOptions;
  accessTokenCookieOptions;
  refreshTokenCookieOptions;
  validateUser(userDetails: UserDetails);
  createUser(userDetails: UserDetails);
  getAccessToken(id: number);
  getRefreshToken(id: number);
  setRefreshToken(id: number, refreshToken: string);
}
