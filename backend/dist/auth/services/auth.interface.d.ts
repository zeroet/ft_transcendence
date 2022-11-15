import { UserDetails } from 'src/utils/types';
export interface IAuthService {
    validateUser(userDetails: UserDetails): any;
    createUser(userDetails: UserDetails): any;
    getTokens(id: number): any;
    getAccessToken(id: number): any;
    getAccessToken(id: number): any;
}
