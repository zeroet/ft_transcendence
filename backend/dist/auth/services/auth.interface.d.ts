import { UserDetails } from 'src/utils/types';
export interface IAuthService {
    validateUser(userDetails: UserDetails): any;
    createUser(userDetails: UserDetails): any;
    getUser(): any;
}
