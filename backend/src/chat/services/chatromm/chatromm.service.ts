import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';

@Injectable()
export class ChatrommService implements IChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(ChatMember)
    private chatMemebrRepository: Repository<ChatMember>,
    @InjectRepository(ChatContent)
    private chatContentRepository: Repository<ChatContent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getAllChatrooms() {
    return await this.chatroomRepository.find();
  }
  async createChatroom(userId: number, createChatroomDto: CreateChatroomDto) {
    // console.log('password:', createChatroomDto.password);
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const chatroom = this.chatroomRepository.create({
      ownerId: userId,
      ...createChatroomDto,
    });
    const createdChatroom = await this.chatroomRepository.save(chatroom);
    const { chatroomId } = createdChatroom;
    const chatroomMemebr = this.chatMemebrRepository.create({
      userId,
      chatroomId,
      Chatroom: chatroom,
      User: user,
    });
    await this.chatMemebrRepository.save(chatroomMemebr);
    return chatroom;

    // const chatroomContent = this.chatContentRepository.create({
    //   chatroomId,
    //   userId,
    //   Chatroom: chatroom,
    //   User: user,
    // });

    // const chatroom = this.chatroomRepository.createQueryBuilder('chatroom');
    //   .innerJoinAndSelect();
    // return this.chatroomRepository.save(chatroom);
  }
  getOneChatroom() {
    throw new Error('Method not implemented.');
  }
  updateChatroom() {
    throw new Error('Method not implemented.');
  }
  getMessages() {
    throw new Error('Method not implemented.');
  }
  postMessages() {
    throw new Error('Method not implemented.');
  }
  getAllMembers(chatroomId: number) {
    return this.userRepository
      .createQueryBuilder('users')
      .innerJoin(
        'users.chatroom',
        'chatroom',
        'chatroom.chatroomId=chatroomId',
        { chatroomId },
      )
      .getMany();
  }
  postMembers(chatroomId: number) {
    // const chatroom = await this.chatroomRepository.findOneByOrFail({chatroomId})
    const chatroom = this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroomId=chatroomId', { chatroomId })
      .getOne();
    if (!chatroom) return null;
    // const user = this.userRepository.createQueryBuilder
  }
}
