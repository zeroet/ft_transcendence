import { UserDto } from 'src/users/dto/user.dto';

export interface IUserService {
  getUsers();
  getUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
