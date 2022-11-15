import { IUserService } from 'src/users/services/user/user.interface';
export declare class UsersController {
    private readonly userService;
    constructor(userService: IUserService);
    getUsers(): any;
    getUserById(id: number): any;
}
