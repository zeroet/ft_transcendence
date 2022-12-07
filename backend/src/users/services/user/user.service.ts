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
      // const user = await this.userRepository.findOne({ where: { id } });
      const user = await this.userRepository
        .createQueryBuilder('users')
        .where('users.id=:id', { id })
        .getOne();
      // console.log('getUserById() user:', user);
      // this.logger.debug('getUserById() user:');
      // console.log(user);
      // console.log('getuserbyid:', user);
      // if (!user) throw new NotFoundException(`User by #id ${id} not found`);
      return user;
    }
  }

  async getAllUsers() {
    // const users = await this.userRepository.find();
    const users = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.Block',
        'block',
        'users.user_id = block.user_id',
      )
      .getMany();
    console.log('users info:', users);
    if (users) return users;
  }

  async blockUser(userId: number, blockUserId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new BadRequestException(`User of id:${userId} doesn't exist`);
    }
    const blockUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:blockUserId', { blockUserId })
      .getOne();
    if (!blockUser) {
      throw new BadRequestException(
        `Block user of id:${blockUserId} doesn't exist`,
      );
    }
    const createdBlock = this.blockRepository.create({
      userId,
      blockedUserId: blockUserId,
      User: user,
      BlockedUser: blockUser,
    });
    // const updateUserInfo = this.userRepository.update(userId, {
    //   Block: createdBlock,
    // });
    return await this.blockRepository.save(createdBlock);
  }

  async unBlockUser(userId: number, unBlockUserId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    const unBlockUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:unBlockUserId', { unBlockUserId })
      .getOne();
    if (!unBlockUser) {
      throw new BadRequestException(
        `UnBlock user of id:${unBlockUserId} doesn't exist`,
      );
    }
    const removedBlock = this.blockRepository
      .createQueryBuilder('block')
      .delete()
      .from(Block)
      .where('user_id=:userId', { userId })
      .andWhere('blocked_user_id=:unBlockUserId', { unBlockUserId })
      .execute();
    return removedBlock;
  }

  // updateUserById(id: number) {}
}
