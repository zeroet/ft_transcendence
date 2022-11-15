import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  private users: UserDto[] = [];
  getUsers(): UserDto[] {
    return this.users;
  }

  createUser(user: UserDto) {
    return this.users.push(user);
  }

  deleteUser() {}
}
