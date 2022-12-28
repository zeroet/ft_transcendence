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
import { Status, StatusArray, UserDetails } from 'src/utils/types';
import { IUserService } from './user.interface';
import { Repository } from 'typeorm';

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

  async findUserByIdOrFail(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async getCurrentUser(userId: number): Promise<User> {
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
      .where('users.user_id=:userId', { userId })
      .getOne();
    return user;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('users')
      .getMany();
    return users;
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

  async validateUser(userDetails: UserDetails) {
    const { intra_id } = userDetails;
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.intra_id=:intra_id', { intra_id })
      .getOne();
    if (user) return user;
    return this.createUser(userDetails);
  }

  createUser(userDetails: UserDetails) {
    const user = this.userRepository.create(userDetails);
    return this.userRepository.save(user);
  }

  async createTestUser(name: string) {
    const userDetails = {
      intra_id: name,
      email: name + '@student.42.fr',
      image_url: process.env.DUMMY_URL,
      username: name,
    };
    return await this.validateUser(userDetails);
  }

  async validateDummy(userDetails: UserDetails) {
    const { intra_id } = userDetails;
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.intra_id=:intra_id', { intra_id })
      .getOne();
    return user;
  }

  async createDummy(userDetails: UserDetails) {
    const user = this.userRepository.create(userDetails);
    return await this.userRepository.save(user);
  }

  async createDummyUser() {
    let name = 'dummy';
    let userDetails = {
      intra_id: name,
      email: name + '@student.42.fr',
      image_url: process.env.DUMMY_URL,
      username: name,
    };
    let dummy = await this.validateDummy(userDetails);
    while (dummy) {
      name = dummy.username.substring(0, 5);
      let number = Number(dummy.username.replace(/[^0-9]/g, ''));
      number += 1;
      name += number;
      userDetails = {
        intra_id: name,
        email: name + '@student.42.fr',
        image_url: process.env.DUMMY_URL,
        username: name,
      };
      dummy = await this.validateDummy(userDetails);
    }
    return this.createDummy(userDetails);
  }

  async deleteDummyUser(user) {
    let count = user.intra_id.indexOf('dummy');
    if (count === 0) {
      const dummy = await this.userRepository
        .createQueryBuilder('users')
        .where('users.user_id=:id', { id: user.id })
        .getOne();
      await this.userRepository.remove(dummy);
      return true;
    }
    return false;
  }

  async updateUserStatus(userId: number, status: Status) {
    const user = await this.findUserByIdOrFail(userId);
    if (StatusArray.includes(status)) {
      user.status = status;
    } else {
      throw new BadRequestException(`User status: ${status} is not valid`);
    }
    const updatedUser = await this.userRepository.save(user);
    this.chatEventsGateway.server.emit('status', updatedUser);
    return updatedUser;
  }

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
        .where('matchhistory.winnerId=:winnerId', { winnerId: id })
        .orWhere('matchhistory.loserId=:loserId', { loserId: id })
        .innerJoinAndSelect('matchhistory.winner', 'winner')
        .innerJoinAndSelect('matchhistory.loser', 'loser')
        .orderBy('matchhistory.date', 'DESC')
        .take(5)
        .getMany();

    return matchs;
  }

  async getRank(id: number) {
    let matchs = null;
    if (id)
      matchs = await this.matchHistoryRepository
        .createQueryBuilder('matchhistory')
        .where('matchhistory.winnerId=:winnerId', { winnerId: id })
        .orWhere('matchhistory.loserId=:loserId', { loserId: id })
        .innerJoinAndSelect('matchhistory.winner', 'winner')
        .innerJoinAndSelect('matchhistory.loser', 'loser')
        .getMany();

    return matchs;
  }
}
