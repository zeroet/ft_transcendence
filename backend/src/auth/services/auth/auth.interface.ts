import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  defaultCookieOptions;
  accessTokenCookieOptions;
  refreshTokenCookieOptions;
  validateUser(userDetails: UserDetails);
  createUser(userDetails: UserDetails);
  getAccessToken(id: number, two_factor_activated: boolean);
  getRefreshToken(id: number);
  setRefreshToken(id: number, refreshToken: string);
  verify(accessToken: any);
  createDummyUser();
}
