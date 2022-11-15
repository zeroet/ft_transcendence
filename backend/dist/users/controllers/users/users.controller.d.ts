import { UserDto } from 'src/users/dto/user.dto';
import { IUserService } from 'src/users/services/user/user.interface';
export declare class UsersController {
    private readonly userService;
    constructor(userService: IUserService);
    getUsers(): any;
    createUser(user: UserDto): any;
    deleteUser(): void;
}
