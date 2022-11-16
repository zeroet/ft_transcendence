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
  getCurrentUser(): Promise<User[]> {
    return this.userRepository.find();
  }
  getUserById(id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User by #id ${id} not found`);
    return user;
  }
  updateUserById(id: number) {}
}
