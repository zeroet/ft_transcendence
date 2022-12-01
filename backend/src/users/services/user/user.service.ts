import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  private logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getCurrentUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }
  async getUserById(id: number) {
    // this.logger.debug(`getUserById() id: ${id}`);
    if (id !== undefined) {
      // const user = await this.userRepository.findOneBy({ id: id });
      const user = await this.userRepository.findOne({ where: { id } });
      // console.log('getUserById() user:', user);
      // this.logger.debug('getUserById() user:');
      // console.log(user);
      // console.log('getuserbyid:', user);
      // if (!user) throw new NotFoundException(`User by #id ${id} not found`);
      return user;
    }
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    if (users) return users;
  }
  updateUserById(id: number) {}
}
