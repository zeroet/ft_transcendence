import { UserDto } from 'src/users/dto/user.dto';
export interface IUserService {
    getUsers(): any;
    createUser(user: UserDto): any;
    deleteUser(): any;
}
