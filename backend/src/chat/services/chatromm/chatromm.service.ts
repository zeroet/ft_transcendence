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
    const chatroom = await this.chatroomRepository.create({
      ownerId: userId,
      ...createChatroomDto,
    });
    return await this.chatroomRepository.save(chatroom);
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
  getAllMembers() {
    throw new Error('Method not implemented.');
  }
  postMembers() {
    throw new Error('Method not implemented.');
  }
}
