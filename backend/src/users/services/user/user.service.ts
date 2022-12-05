import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Block, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  private logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Block) private blockRepository: Repository<Block>,
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

  async blockUser(userId: number, targetUserId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    const targetUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:targetUserId', { targetUserId })
      .getOne();
    if (!targetUser) {
      throw new BadRequestException(
        `Target user of id:${targetUserId} doesn't exist`,
      );
    }
    const createdBlock = this.blockRepository.create({
      userId,
      blockedUserId: targetUserId,
      User: user,
      BlockedUser: targetUser,
    });
    return await this.blockRepository.save(createdBlock);
  }

  // updateUserById(id: number) {}
}
