import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';
export declare class UserService implements IUserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User>;
    updateUserById(id: number): void;
}
