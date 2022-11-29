import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getCurrentUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }
  async getUserById(id: number): Promise<User> {
    console.log('getUserById() id:', id);
    // if (id !== undefined) {
    // const user = await this.userRepository.findOneBy({ id: id });
    const user = await this.userRepository.findOne({ where: { id } });
    console.log('getUserById() user:', user);
    // console.log('getuserbyid:', user);
    if (!user) throw new NotFoundException(`User by #id ${id} not found`);
    return user;
    // }
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    if (users) return users;
  }
  updateUserById(id: number) {}
}
