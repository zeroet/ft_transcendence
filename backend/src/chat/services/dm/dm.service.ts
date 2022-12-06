import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { Dm, User } from 'src/typeorm';
import { IsNull, Repository } from 'typeorm';
import { IDmService } from './dm.interface';

@Injectable()
export class DmService implements IDmService {
  constructor(
    @InjectRepository(Dm) private dmRepository: Repository<Dm>,
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

  async getDmList(senderId: number, receiverId: number) {
    const sender = await this.findUserByIdOrFail(senderId);
    // const receiver = await this.findUserByIdOrFail(receiverId);
    // const dms = await this.userRepository
    //   .createQueryBuilder('users')
    //   .leftJoin('users.DmSender', 'dm', 'dm.sender_id=:senderId', { senderId })
    //   .getMany();
    const dms = await this.dmRepository
      .createQueryBuilder('dm')
      .distinctOn(['dm.receiver_id, dm.sender_id'])
      .where('dm.sender_id=:senderId', { senderId })
      .innerJoinAndSelect('dm.Receiver', 'receiver')
      .innerJoinAndSelect('dm.Sender', 'sender')
      .select([
        'dm',
        'receiver.id',
        'receiver.username',
        'receiver.image_url',
        'sender.id',
        'sender.username',
        'sender.image_url',
      ])
      //   .andWhere('dm.receiver_id=:receiverId', { receiverId })
      .getMany();
    console.log('dms:', dms);
    // this.chatEventsGateway.server.emit('newDmList', dms);
    return dms;
  }

  async createDm(senderId: number, receiverId: number) {
    const sender = await this.findUserByIdOrFail(senderId);
    const receiver = await this.findUserByIdOrFail(receiverId);
    const dm = await this.dmRepository
      .createQueryBuilder('dm')
      //   .where('dm.dm_id=:dmId', { dmId })
      .where('dm.sender_id=:senderId', { senderId })
      .andWhere('dm.receiver_id=:receiverId', { receiverId })
      .getOne();
    if (dm) {
      this.chatEventsGateway.server.emit('newDmList', dm);
      return dm;
      //   throw new BadRequestException(
      //     `Dm of users of id:${senderId} and ${receiverId} already exists`,
      //   );
    }
    const newDm = this.dmRepository.create({
      senderId,
      receiverId,
      Sender: sender,
      Receiver: receiver,
    });
    await this.dmRepository.save(newDm);
    console.log(newDm);
    this.chatEventsGateway.server.emit('newDmList', newDm);
    return newDm;
  }

  async getMembers(senderId: number, receiverId: number) {
    const members = await this.dmRepository
      .createQueryBuilder('dm')
      .select('dm.sender_id', 'dm.receiver_id')
      .where('dm.sender_id=:senderId', { senderId })
      .andWhere('dm.receiver_id=:receiverId', { receiverId })
      .getOne();
    console.log('dm members:', members);
    return members;
  }

  async getContents(senderId: number, receiverId: number) {
    const sender = await this.findUserByIdOrFail(senderId);
    const receiver = await this.findUserByIdOrFail(receiverId);
    const contents = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.sender_id=:senderId', { senderId })
      .andWhere('dm.receiver_id=:receiverId', { receiverId })
      //   .where('dm.dm_id=:dmId', { dmId })
      .innerJoinAndSelect('dm.Sender', 'sender')
      .innerJoinAndSelect('dm.Receiver', 'receiver')
      //   .select(['dm', ]);
      .getMany();
    console.log('dm contents:', contents);
    return contents;
  }

  async postContents(senderId: number, receiverId: number, content: string) {
    const sender = await this.findUserByIdOrFail(senderId);
    const receiver = await this.findUserByIdOrFail(receiverId);
    // const dm = await this.findDmByIdOrFail(dmId);
    const newContent = this.dmRepository.create({
      senderId,
      receiverId,
      content,
      Sender: sender,
      Receiver: receiver,
    });
    await this.dmRepository.save(newContent);
    this.chatEventsGateway.server.emit('newDmContent', newContent);
  }
}
