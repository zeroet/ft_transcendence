import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/events/chat.events.gateway';
import { Block, Friend, User } from 'src/typeorm';
import { Status } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  private logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Block) private blockRepository: Repository<Block>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async findUserByIdOrFail(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.Block',
        'block',
        'users.user_id = block.user_id',
      )
      .leftJoinAndSelect(
        'users.Friend',
        'friend',
        'users.user_id = friend.user_id',
      )
      .where('users.user_id=:id', { id })
      // .innerJoinAndSelect('friend.FriendUser.status', 'status')
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      // .innerJoinAndMapMany('friend.FriendUser', 'friendUser')
      // .select(['users', 'friend.friendUser.status'])
      .getOne();

    const FriendUsers = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:id', { id })
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      .getMany();

    console.log('friend users:', FriendUsers);
    // if (FriendUsers.length > 0) {
    for (let i = 0; i < user.Friend.length; i++) {
      for (let j = 0; j < FriendUsers.length; j++) {
        if (user.Friend[i].friendUserId === FriendUsers[j].FriendUser.id) {
          console.log('testtest');
          const { status } = user.Friend[i].FriendUser;
          // delete user.Friend[i].FriendUser.email;
          // delete user.Friend[i].FriendUser.created_at;
          // delete user.Friend[i].FriendUser.modified_at;
          // delete user.Friend[i].FriendUser.image_url;
          // delete user.Friend[i].FriendUser.two_factor_activated;
          // delete user.Friend[i].FriendUser.two_factor_valid;
          // delete user.Friend[i].FriendUser.intra_id;
          // delete user.Friend[i].FriendUser.username;
          // delete user.Friend[i].FriendUser.id;
          delete user.Friend[i].FriendUser;
          user.Friend[i]['status'] = status;
          // user.Friend[i].FriendUser['test'] = 'test';
        }
      }
      // }
    }
    return user;
  }
  async getUserById(id: number) {
    this.logger.debug(`getUserById() id: ${id}`);
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:id', { id })
      .getOne();
    return user;
  }

  async getAllUsers() {
    // const users = await this.userRepository.find();
    const users = await this.userRepository
      .createQueryBuilder('users')
      .getMany();
    // console.log('users info:', users);
    if (users) return users;
  }

  async blockUser(userId: number, blockUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const blockUser = await this.findUserByIdOrFail(blockUserId);
    const block = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .andWhere('block.blocked_user_id=:blockUserId', { blockUserId })
      .getOne();
    if (block) {
      throw new BadRequestException(
        `${user.username} already blocked ${blockUser.username}`,
      );
    }
    const createdBlock = this.blockRepository.create({
      userId,
      blockedUserId: blockUserId,
      User: user,
      BlockedUser: blockUser,
    });
    return await this.blockRepository.save(createdBlock);
  }

  async unBlockUser(userId: number, unBlockUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const unBlockUser = await this.findUserByIdOrFail(unBlockUserId);
    const block = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .andWhere('block.blocked_user_id=:unBlockUserId', { unBlockUserId })
      .getOne();
    if (!block) {
      throw new BadRequestException(
        `${user.username} already unblocked ${unBlockUser.username}`,
      );
    }
    const removedBlock = await this.blockRepository.remove(block);
    console.log('removed block:', removedBlock);
    return removedBlock;
  }

  async getBlockList(userId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const blocks = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .getMany();
    return blocks;
  }

  async addFriend(userId: number, friendUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const friendUser = await this.findUserByIdOrFail(friendUserId);
    const friend = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .andWhere('friend.friend_user_id=:friendUserId', { friendUserId })
      .getOne();
    if (friend) {
      throw new BadRequestException(
        `${user.username} already added ${friendUser.username} as a friend`,
      );
    }
    const createdfriend = this.friendRepository.create({
      userId,
      friendUserId,
      friendUsername: friendUser.username,
      User: user,
      FriendUser: friendUser,
    });
    return await this.friendRepository.save(createdfriend);
  }

  async deleteFriend(userId: number, unFriendUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const unFriendUser = await this.findUserByIdOrFail(unFriendUserId);
    const friend = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .andWhere('friend.friend_user_id=:unFriendUserId', { unFriendUserId })
      .getOne();
    if (!friend) {
      throw new BadRequestException(
        `${user.username} already deleted ${unFriendUser.username} from friends list`,
      );
    }
    const removedFriend = await this.friendRepository.remove(friend);
    console.log('removed friend:', removedFriend);
    return removedFriend;
  }

  async getFriendList(userId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const friends = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      .getMany();
    return friends;
  }

  async updateUserStatus(userId: number, status: Status) {
    const user = await this.findUserByIdOrFail(userId);
    user.status = status;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
  // updateUserById(id: number) {}
}
