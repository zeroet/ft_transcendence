import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(userDetails: UserDetails);
  createUser(userDetails: UserDetails);
  getUser();
}
