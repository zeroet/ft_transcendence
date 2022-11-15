import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';
export declare class AuthService implements IAuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validateUser(userDetails: UserDetails): Promise<User>;
    createUser(userDetails: UserDetails): Promise<User>;
    getUser(): void;
}
