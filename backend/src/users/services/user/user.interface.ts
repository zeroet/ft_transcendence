import { UserDto } from 'src/users/dto/user.dto';

export interface IUserService {
  getUsers();
  createUser(user: UserDto);
  deleteUser();
}
