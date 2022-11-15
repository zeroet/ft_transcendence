import { UserDto } from 'src/users/dto/user.dto';

export interface IUserService {
  getUsers();
  getUserById(id: number);
  updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
