import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/events/chat.events.gateway';
import { Block, Friend, MatchHistory, User } from 'src/typeorm';
import { Status } from 'src/utils/types';
import { IUserService } from './user.interface';
import { Repository } from 'typeorm';
import { ConnectionGateway } from 'src/connection/connection.gateway';

@Injectable()
export class UserService implements IUserService {
  private logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Block) private blockRepository: Repository<Block>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
    private chatEventsGateway: ChatEventsGateway,
  ) {}
  private connectionGateway: ConnectionGateway;

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
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      .where('users.user_id=:id', { id })
      .getOne();
    const FriendUsers = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:id', { id })
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      .getMany();

    // console.log('friend users:', FriendUsers);
    for (let i = 0; i < user.Friend.length; i++) {
      for (let j = 0; j < FriendUsers.length; j++) {
        if (user.Friend[i].friendUserId === FriendUsers[j].FriendUser.id) {
          const { status, username } = user.Friend[i].FriendUser;
          delete user.Friend[i].FriendUser;
          user.Friend[i]['status'] = status;
          user.Friend[i]['friendUsername'] = username;
        }
      }
    }
    return user;
  }

  async getUserById(id: number) {
    // this.logger.debug(`getUserById() id: ${id}`);
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
      // friendUsername: friendUser.username,
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
    const FriendUsers = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .innerJoinAndSelect('friend.FriendUser', 'friendUser')
      .getMany();
    for (let i = 0; i < friends.length; i++) {
      for (let j = 0; j < FriendUsers.length; j++) {
        if (friends[i].friendUserId === FriendUsers[j].FriendUser.id) {
          const { status, username } = friends[i].FriendUser;
          delete friends[i].FriendUser;
          friends[i]['status'] = status;
          friends[i]['friendUsername'] = username;
        }
      }
    }
    return friends;
  }

  async updateUserStatus(userId: number, status: Status) {
    const user = await this.findUserByIdOrFail(userId);
    // if (
    //   status === Status.LOGIN ||
    //   status === Status.LOGOUT ||
    //   status === Status.PLAYING
    // )
    user.status = status;
    // else {
    //   throw new BadRequestException(`User status: ${status} is not valid`);
    // }
    const updatedUser = await this.userRepository.save(user);
    this.chatEventsGateway.server.emit('status', updatedUser);
    return updatedUser;
  }
  // updateUserById(id: number) {}

  async createMatchHistory(info: any) {
    const match = this.matchHistoryRepository.create({ ...info });
    try {
      await this.matchHistoryRepository.save(match);
    } catch (error) {
      throw new HttpException(error.mesage, 404);
    }
  }

  async getMatch(id: number) {
    let matchs = null;
    if (id)
      matchs = await this.matchHistoryRepository
        .createQueryBuilder('matchhistory')
        .innerJoinAndSelect('matchhistory.winner', 'winner')
        .innerJoinAndSelect('matchhistory.loser', 'loser')
        .orderBy('matchhistory.date', 'DESC')
        .take(5)
        .getMany();

    // this.connectionGateway.server.emit('match');

    return matchs;
  }

  async getRank(id: number) {
    let matchs = null;
    if (id)
      matchs = await this.matchHistoryRepository
        .createQueryBuilder('matchhistory')
        .innerJoinAndSelect('matchhistory.winner', 'winner')
        .innerJoinAndSelect('matchhistory.loser', 'loser')
        .getMany();

    return matchs;
  }
}
