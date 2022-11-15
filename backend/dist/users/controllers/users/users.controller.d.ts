import { IUserService } from 'src/users/services/user/user.interface';
export declare class UsersController {
    private readonly userService;
    constructor(userService: IUserService);
    getUsers(): Promise<any>;
    getUserById(id: number): any;
    updateUserById(id: number): void;
}
