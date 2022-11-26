import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { Chatroom } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';

@Injectable()
export class ChatrommService implements IChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
  ) {}
  getAllChatrooms() {
    this.chatroomRepository.find();
  }
  createChatroom(user_id: number, createChatroomDto: CreateChatroomDto) {
    // const chatroom = this.chatroomRepository.createQueryBuilder('chatroom');
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
