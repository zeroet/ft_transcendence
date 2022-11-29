import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.userRepository.findOneBy({ id: id });
    // console.log('getuserbyid:', user);
    if (!user) throw new NotFoundException(`User by #id ${id} not found`);
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }
  updateUserById(id: number) {}
}
