import { UserDto } from 'src/users/dto/user.dto';
import { IUserService } from './user.interface';
export declare class UserService implements IUserService {
    private users;
    getUsers(): UserDto[];
    createUser(user: UserDto): number;
    deleteUser(): void;
}
