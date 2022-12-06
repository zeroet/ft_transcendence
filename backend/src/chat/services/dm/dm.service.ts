import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { Dm, User } from 'src/typeorm';
import { DmContent } from 'src/typeorm/entities/dmContent.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { IDmService } from './dm.interface';

@Injectable()
export class DmService implements IDmService {
  constructor(
    @InjectRepository(Dm) private dmRepository: Repository<Dm>,
    @InjectRepository(DmContent)
    private dmContentRepository: Repository<DmContent>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private chatEventsGateway: ChatEventsGateway,
  ) {}

  async findUserByIdOrFail(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      //   console.log(`findUserByIdOrFail of id: ${userId} not found,`);
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async findMemberById(userId: number, dmId: number) {
    const member = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.dm_id= :dmId', { dmId })
      .andWhere('dm.user1= :userId', { userId })
      .orWhere('dm.user2=:userId', { userId })
      .getOne();
    return member;
  }

  async findMemberByIdOrFail(userId: number, dmId: number) {
    const member = await this.findMemberById(userId, dmId);
    if (!member) {
      throw new NotFoundException(
        `User of id:${userId} doesn't exist in the dm of id:${dmId}`,
      );
    }
    return member;
  }

  async findDmByIdOrFail(dmId: number) {
    const dm = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.dm_id=:dmId', { dmId })
      .getOne();
    if (!dm) {
      throw new NotFoundException(`Dm of id:${dmId} not found`);
    }
    return dm;
  }

  async getDmList() {
    const dms = await this.dmRepository
      .createQueryBuilder('dm')
      .innerJoinAndSelect('dm.User1', 'user1')
      .innerJoinAndSelect('dm.User2', 'user2')
      .select([
        'dm',
        'user1.id',
        'user1.username',
        'user1.image_url',
        'user2.id',
        'user2.username',
        'user2.image_url',
      ])
      .getMany();
    console.log('dms:', dms);
    return dms;
  }

  async getOneDm(dmId: number) {
    const dm = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.dm_id=:dmId', { dmId })
      .innerJoinAndSelect('dm.User1', 'user1')
      .innerJoinAndSelect('dm.User2', 'user2')
      .select([
        'dm',
        'user1.id',
        'user1.username',
        'user1.image_url',
        'user2.id',
        'user2.username',
        'user2.image_url',
      ])
      .getOne();
    console.log('dm info:', dm);
    return dm;
  }

  async createDm(senderId: number, receiverId: number) {
    const sender = await this.findUserByIdOrFail(senderId);
    const receiver = await this.findUserByIdOrFail(receiverId);
    const dm = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.user1=:senderId', { senderId })
      .andWhere('dm.user2=:receiverId', { receiverId })
      .getOne();
    if (dm) {
      throw new BadRequestException(`Dm already exist`);
    }
    const dm2 = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.user2=:senderId', { senderId })
      .andWhere('dm.user1=:receiverId', { receiverId })
      .getOne();

    if (dm2) {
      throw new BadRequestException(`Dm already exist`);
    }

    const newDm = this.dmRepository.create({
      user1: senderId,
      user2: receiverId,
      User1: sender,
      User2: receiver,
    });
    await this.dmRepository.save(newDm);
    console.log('newDm:', newDm);
    this.chatEventsGateway.server.emit('newDmList', newDm);
    return newDm;
  }

  async getMembers(dmId: number) {
    const members = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.dm_id=:dmId', { dmId })
      .innerJoinAndSelect('dm.User1', 'user1')
      .innerJoinAndSelect('dm.User2', 'user2')
      .select([
        'dm',
        'user1.id',
        'user1.username',
        'user1.image_url',
        'user2.id',
        'user2.username',
        'user2.image_url',
      ])
      .getMany();
    console.log('dm members:', members);
    return members;
  }

  // async postMembers(userId: number, dmId: number) {
  //   const dm = await this.findDmByIdOrFail(dmId);
  //   const user = await this.findUserByIdOrFail(userId);
  //   const member = await this.findMemberById(userId, dmId);
  //   if (member) {
  //     console.log(`User already exists in the dm of id:${dmId}`, member);
  //     throw new BadRequestException(
  //       `User already exists in the dm of id:${dmId}`,
  //     );
  //   }
  // }

  async getContents(senderId: number, dmId: number) {
    const sender = await this.findUserByIdOrFail(senderId);
    // const receiver = await this.findUserByIdOrFail(receiverId);
    const contents = await this.dmContentRepository
      .createQueryBuilder('dm_content')
      .where('dm_content.dm_id=:dmId', { dmId })
      .innerJoinAndSelect('dm_content.User', 'user')
      // .innerJoinAndSelect(Dm, 'dm', 'dm.dm_id=:dmId', { dmId })
      // .innerJoinAndSelect('dm.User2', 'user2')
      .select(['dm_content', 'user.username'])
      .getMany();
    console.log('dm contents:', contents);
    return contents;
  }

  async postContents(
    senderId: number,
    // receiverId: number,
    dmId: number,
    content: string,
  ) {
    const dm = await this.findDmByIdOrFail(dmId);
    const sender = await this.findUserByIdOrFail(senderId);
    // const receiver = await this.findUserByIdOrFail(receiverId);
    const newContent = this.dmContentRepository.create({
      dmId,
      userId: senderId,
      content,
      Dm: dm,
      User: sender,
    });
    await this.dmContentRepository.save(newContent);
    console.log('new dm content:', newContent);
    this.chatEventsGateway.server.emit('newDmContent', newContent);
  }

  async getUnreads(userId: number, senderId: number, after: number) {
    const unReadCount = this.dmRepository.count({
      where: {
        user1: senderId,
        user2: userId,
        createdAt: MoreThan(new Date(after)),
      },
    });
    console.log('unReadCount', unReadCount);
    return unReadCount;
  }
}
