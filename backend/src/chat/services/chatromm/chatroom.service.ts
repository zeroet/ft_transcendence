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

  async findById(chatroomId: number) {
    return await this.chatroomRepository.findOneBy({ chatroomId: chatroomId });
  }
  async getAllChatrooms() {
    return await this.chatroomRepository.find();
  }
  async createChatroom(userId: number, createChatroomDto: CreateChatroomDto) {
    // console.log('password:', createChatroomDto.password);
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    // const queryRunner = this.dataSource.createQueryRunner();
    // queryRunner.connect();
    const { chatroomName } = createChatroomDto;
    const chatroom = this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroom_name = chatroom_name', { chatroomName })
      .getOne();
    if (!chatroom)
      throw new NotFoundException(
        `Chatroom of name: ${chatroomName} not found`,
      );
    const newChatroom = this.chatroomRepository.create({
      ownerId: userId,
      ...createChatroomDto,
    });
    const createdChatroom = await this.chatroomRepository.save(newChatroom);

    const chatroomMemebr = this.chatMemebrRepository.create({
      userId: userId,
      chatroomId: createdChatroom.chatroomId,
      Chatroom: newChatroom,
      User: user,
    });
    await this.chatMemebrRepository.save(chatroomMemebr);
    this.chatEventsGateway.server.emit('newRoomList', 'chatroom created');
    console.log(newChatroom);
    return newChatroom;

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
  async getOneChatroom(chatroomId: number) {
    // console.log('getOneChatroom() typeof chatroomId:', typeof chatroomId);

    // const chatroom = await this.chatroomRepository
    //   .createQueryBuilder('chatroom')
    //   .leftJoinAndSelect(
    //     'chatroom.ChatMember',
    //     'chat_member',
    //     'chat_member.chatroom_id=chatroom_id',
    //     { chatroomId },
    //   );
    const chatroom = await this.chatroomRepository.findOne({
      where: {
        chatroomId: chatroomId,
      },
      relations: ['ChatMember'],
    });
    // const chatroom = await this.findById(chatroomId);
    if (!chatroom)
      throw new NotFoundException(`Chatroom of id:${chatroomId} not found`);
    console.log('current chatroom info:', chatroom);
    return chatroom;
  }
  updateChatroom() {
    throw new Error('Method not implemented.');
  }
  getContents() {
    throw new Error('Method not implemented.');
  }
  postContents() {
    throw new Error('Method not implemented.');
  }
  getAllMembers(chatroomId: number) {
    console.log('test', typeof chatroomId, chatroomId);
    return (
      this.chatMemebrRepository
        .createQueryBuilder('chat_member')
        // .select('chat_member.userId')
        .innerJoin(
          'chat_member.Chatroom',
          'chatroom',
          'chatroom.chatroom_id = :chatroomId',
          { chatroomId },
        )
        // .select('user.username')
        .innerJoinAndSelect('chat_member.User', 'user')
        // .select('user.username')
        .getMany()
    );
    // return this.userRepository
    //   .createQueryBuilder('users')
    //   .innerJoin(
    //     'users.Chatroom',
    //     'chatroom',
    //     'chatroom.chatroom_name=:chatroomName',
    //     { chatroomName },
    //   )
    //   .getMany();
  }
  async postMembers(userId: number, chatroomId: number) {
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroom_id=:chatroom_id', { chatroomId })
      .getOne();
    if (!chatroom)
      throw new NotFoundException(`Chatroom of id: ${chatroomId} not found`);
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:user_id', { userId })
      .getOne();
    if (!user) throw new NotFoundException(`User not found`);
    const chatroomMember = this.chatMemebrRepository.create({
      userId,
      chatroomId,
    });
    await this.chatMemebrRepository.save(chatroomMember);
  }
}
