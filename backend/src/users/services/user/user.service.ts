import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
  getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
