import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';

@Injectable()
export class ChatroomService implements IChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(ChatMember)
    private chatMemebrRepository: Repository<ChatMember>,
    @InjectRepository(ChatContent)
    private chatContentRepository: Repository<ChatContent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private chatEventsGateway: ChatEventsGateway,
  ) {}
  async getAllChatrooms() {
    return await this.chatroomRepository.find();
  }
  async createChatroom(userId: number, createChatroomDto: CreateChatroomDto) {
    // console.log('password:', createChatroomDto.password);
    // const user = await this.userRepository.findOneByOrFail({ id: userId });

    // const queryRunner = this.dataSource.createQueryRunner();
    // queryRunner.connect();

    const { chatroomName } = createChatroomDto;
    const chatroom = this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroom_name=chatroom_name', { chatroomName })
      .getOne();
    if (!chatroom)
      throw new NotFoundException(
        `Chatroom of name: ${chatroomName} not found`,
      );
    const Newchatroom = this.chatroomRepository.create({
      ownerId: userId,
      ...createChatroomDto,
    });
    const createdChatroom = await this.chatroomRepository.save(Newchatroom);

    // const { chatroomId } = createdChatroom;
    // const chatroomMemebr = this.chatMemebrRepository.create({
    //   userId: userId,
    //   chatroomId: createdChatroom.chatroomId,
    // });
    // await this.chatMemebrRepository.save(chatroomMemebr);
    this.chatEventsGateway.server.emit('newRoomList', 'chatroom created');
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
  async postMembers(userId: number, chatroomId: number) {
    // const chatroom = await this.chatroomRepository.findOneByOrFail({chatroomId})
    const chatroom = this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroomId=chatroomId', { chatroomId })
      .getOne();
    if (!chatroom)
      throw new NotFoundException(`Chatroom of id: ${chatroomId} not found`);
    const user = this.userRepository
      .createQueryBuilder('users')
      .where('users.id=userId', { userId })
      .getOne();
    if (!user) throw new NotFoundException(`User not found`);
    const chatroomMember = this.chatMemebrRepository.create({
      userId,
      chatroomId,
    });
    await this.chatMemebrRepository.save(chatroomMember);
  }
}
