import { UserDto } from 'src/users/dto/user.dto';

export interface IUserService {
  getCurrentUser();
  getUserById(id: number);
  updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
