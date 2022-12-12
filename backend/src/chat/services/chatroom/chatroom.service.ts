import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { ChatEventsGateway } from 'src/events/chat.events.gateway';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { Block, ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { IChatroom } from 'src/typeorm/interfaces/IChatroom';
import { DataSource, Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';
import * as bcrypt from 'bcrypt';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';
import { SchedulerRegistry } from '@nestjs/schedule';

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
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private dataSource: DataSource,
    private chatEventsGateway: ChatEventsGateway,
  ) {}

  async findUserByIdOrFail(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      console.log(`findUserByIdOrFail of id: ${userId} not found,`);
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async findMemberById(userId: number, chatroomId: number) {
    const member = await this.chatMemebrRepository
      .createQueryBuilder('chat_member')
      .where('chat_member.chatroom_id = :chatroomId', { chatroomId })
      .andWhere('chat_member.user_id = :userId', { userId })
      .getOne();
    return member;
  }

  async findMemberByIdOrFail(userId: number, chatroomId: number) {
    const member = await this.findMemberById(userId, chatroomId);
    if (!member) {
      throw new NotFoundException(
        `User of id:${userId} doesn't exist in the chatroom of id:${chatroomId}`,
      );
    }
    return member;
  }

  async findChatroomByIdOrFail(chatroomId: number) {
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_id=:chatroomId', { chatroomId })
      .getOne();
    if (!chatroom) {
      console.log(`findChatroomByIdOrFail of id: ${chatroomId} not found,`);
      throw new NotFoundException(`Chatroom of id:${chatroomId} not found`);
    }
    return chatroom;
  }

  async findChatroomByName(chatroomName: string) {
    return await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name=:chatroomName', { chatroomName })
      .getOne();
  }

  async findChatroomByNameOrFail(chatroomName: string) {
    const chatroom = await this.findChatroomByName(chatroomName);
    if (!chatroom) {
      console.log(
        `findChatroomByNameOrFail of id: '${chatroomName}' not found,`,
      );
      throw new NotFoundException(`Chatroom of id:${chatroomName} not found`);
    }
    return chatroom;
  }

  async getChatroomsInfo(chatrooms: IChatroom[]) {
    return await Promise.all(
      chatrooms.map((chatroom: any) => {
        if (chatroom.password !== null) chatroom.isPrivate = true;
        else chatroom.isPrivate = false;
        const { password, ...result } = chatroom;
        return result;
      }),
    );
  }

  hashData(data: string) {
    return bcrypt.hash(data, 11);
  }

  addNewTimeout(
    timeoutName: string,
    targetUserId: number,
    chatroomId: number,
    milliseconds: number,
  ) {
    const callback = async () => {
      console.log(`Timeout ${timeoutName} executing after ${milliseconds}`);
      const targetUser = await this.findMemberById(targetUserId, chatroomId);
      targetUser.mutedAt = null;
      await this.chatMemebrRepository.save(targetUser);
      this.schedulerRegistry.deleteTimeout(timeoutName);
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutName, timeout);
  }

  deleteTimeout(timeoutName: string) {
    this.schedulerRegistry.deleteTimeout(timeoutName);
  }

  getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => console.log(`Timout name: ${key}`));
    return timeouts;
  }

  async getChatrooms(): Promise<ChatroomDto[]> {
    const chatrooms = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .getMany();
    return await this.getChatroomsInfo(chatrooms);
  }

  async createChatroom(
    userId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto> {
    // console.log('password:', createChatroomDto.password);
    // console.log('typeof userId:', userId, typeof userId);
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    // const queryRunner = this.dataSource.createQueryRunner();
    // queryRunner.connect();
    const { chatroomName, password } = createChatroomDto;
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name = :chatroomName', { chatroomName })
      .getOne();
    if (chatroom)
      // console.log(`Chatroom of name: ${chatroomName} already exists`);
      throw new BadRequestException(
        `Chatroom of name: '${chatroomName}' already exists`,
      );

    const hashedPassword =
      password !== null
        ? await this.hashData(createChatroomDto.password)
        : null;
    // console.log('hashedPassword:', hashedPassword);
    const newChatroom = this.chatroomRepository.create({
      ownerId: userId,
      chatroomName,
      password: hashedPassword,
    });
    const createdChatroom = await this.chatroomRepository.save(newChatroom);
    const newMemebr = this.chatMemebrRepository.create({
      userId: userId,
      chatroomId: createdChatroom.id,
      Chatroom: newChatroom,
      User: user,
    });
    await this.chatMemebrRepository.save(newMemebr);
    this.chatEventsGateway.server.emit('newRoomList', createdChatroom);
    console.log(newChatroom);
    const result = await this.getChatroomsInfo([newChatroom]);
    return result[0];
  }

  async getOneChatroom(chatroomId: number): Promise<ChatroomDto> {
    // console.log('getOneChatroom() typeof chatroomId:', typeof chatroomId);
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    console.log('current chatroom info:', chatroom);
    const result = await this.getChatroomsInfo([chatroom]);
    console.log(result[0]);
    return result[0];
  }

  async deleteChatroom(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const removedChatroom = await this.chatroomRepository.remove(chatroom);
    // const removedChatroom = await this.chatroomRepository
    //   .createQueryBuilder('chatroom')
    //   .delete()
    //   .from(Chatroom)
    //   .where('owner_id=:userId', { userId })
    //   .andWhere('chatroom_id=:chatroomId', { chatroomId })
    //   .execute();
    console.log('removed chatroom:', removedChatroom);
    this.chatEventsGateway.server.emit('deleteChatroom', chatroomId);
    this.chatEventsGateway.server.emit('newRoomList', removedChatroom);
    this.chatEventsGateway.server.emit('newMemberList', null);
    return removedChatroom;
  }

  async verifyChatroomPassword(chatroomId: number, password: string) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const isMatch = await bcrypt.compare(password, chatroom.password);
    if (!isMatch) return false;
    return true;
  }

  async updateChatroomInfo(
    userId: number,
    chatroomId: number,
    updateChatroomDto: UpdateChatroomDto,
  ) {
    const { chatroomName, password } = updateChatroomDto;
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    // const user = await this.findUserByIdOrFail(userId);

    if (chatroom.ownerId !== member.userId) {
      throw new UnauthorizedException(
        `No permission for User ${member.User.username}`,
      );
    }
    const newChatroom = await this.findChatroomByName(chatroomName);
    if (newChatroom && newChatroom?.chatroomName !== chatroom.chatroomName) {
      throw new BadRequestException(
        `Chatroom of name:${chatroomName} already exists`,
      );
    }
    const hashedPassword =
      password !== null
        ? await this.hashData(updateChatroomDto.password)
        : null;

    // const updatedChatroom = await this.chatroomRepository.update(chatroomId, {
    //   chatroomName,
    //   password: hashedPassword,
    // });
    chatroom.password = hashedPassword;
    chatroom.chatroomName = chatroomName;
    const updatedChatroom = await this.chatroomRepository.save(chatroom);
    console.log('updated chatroom:', updatedChatroom);
    this.chatEventsGateway.server.emit('newRoomList', updatedChatroom);
    return updatedChatroom;
  }

  async getMembers(chatroomId: number) {
    let members = await this.chatMemebrRepository
      .createQueryBuilder('chat_member')
      .innerJoin(
        'chat_member.Chatroom',
        'chatroom',
        'chatroom.chatroom_id = :chatroomId',
        { chatroomId },
      )
      .innerJoinAndSelect('chat_member.User', 'user')
      .select(['chat_member', 'user.username', 'user.image_url'])
      .getMany();
    members = members.filter((member: any) => member.bannedAt === null);
    // console.log('members:', members);
    return members;
  }

  async postMembers(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const member = await this.findMemberById(userId, chatroomId);
    if (member && member.bannedAt !== null) {
      console.log(
        `User is banned from the chatroom of id${chatroomId}`,
        member,
      );
      throw new UnauthorizedException(
        `User is banned from the chatroom of id:${chatroomId}`,
      );
    } else if (member) {
      console.log(
        `User already exists in the chatroom of id:${chatroomId}`,
        member,
      );
      throw new BadRequestException(
        `User already exists in the chatroom of id:${chatroomId}`,
      );
    }

    const newMember = this.chatMemebrRepository.create({
      userId,
      chatroomId,
      Chatroom: chatroom,
      User: user,
    });
    console.log('newMember:', newMember);
    const savedMember = await this.chatMemebrRepository.save(newMember);
    console.log('savedMember:', savedMember);
    this.chatEventsGateway.server.emit('newMemberList', savedMember);
    // return chatroomMember;
  }

  async updateMemberInfo(
    userId: number,
    chatroomId: number,
    updateMemberDto: UpdateMemberDto,
  ) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const targetUser = await this.findMemberByIdOrFail(
      updateMemberDto.targetUserId,
      chatroomId,
    );
    let updatedMember = null;
    // owner verification
    if (member.userId !== chatroom.ownerId) {
      throw new UnauthorizedException(
        `User of id:${userId} is not an admin of chatroom of id:${chatroomId}`,
      );
    }
    // kick
    if (updateMemberDto.kick === true) {
      // updatedMember = await this.deleteMembers(
      //   updateMemberDto.targetUserId,
      //   chatroomId,
      // );
      this.chatEventsGateway.server.emit('kick', {
        chatroomId: chatroomId,
        targetUserId: targetUser.id,
      });
      // return updatedMember;
      // return deletedUser;
    }
    // mute
    else if (updateMemberDto.mute === true) {
      this.addNewTimeout(
        `${targetUser.id}_muted`,
        targetUser.id,
        chatroomId,
        360000,
      );
      targetUser.mutedAt = new Date(360000);
      updatedMember = await this.userRepository.save(targetUser);
      this.chatEventsGateway.server.emit('mute', targetUser);
    }
    // }
    console.log('updated member:', updatedMember);
    return updatedMember;
  }

  async changeAdmin(userId: number, chatroomId: number, targetUserId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const targetUser = await this.findMemberByIdOrFail(
      targetUserId,
      chatroomId,
    );
    if (member.userId !== chatroom.ownerId) {
      throw new UnauthorizedException(
        `User of id:${userId} is not an admin of chatroom of id:${chatroomId}`,
      );
    }
    // set ad admin
    chatroom.ownerId = targetUserId;
    const updatedChatroom = await this.chatroomRepository.save(chatroom);
    // const updatedChatroom = await this.chatroomRepository.update(userId, {
    //   ownerId: targetUserId,
    // });
    // console.log('updated chatroom owner:', updatedChatroom);
    this.chatEventsGateway.server.emit('newMemberList', updatedChatroom);
    return updatedChatroom;
  }

  async deleteMembers(userId: number, chatroomId: number) {
    await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const removedMember = await this.chatMemebrRepository.remove(member);
    console.log('removed member:', removedMember);
    this.chatEventsGateway.server.emit('newMemberList', removedMember);
  }

  async getContents(userId: number, chatroomId: number) {
    // const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    console.log('my user id:', user.id);
    const Blockedusers = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      // .select('block.blocked_user_id')
      .getMany();
    console.log('Blocked users:', Blockedusers, Blockedusers.length);
    let contents = await this.chatContentRepository
      .createQueryBuilder('chat_content')
      .where('chat_content.chatroom_id=:chatroomId', { chatroomId })
      .innerJoinAndSelect('chat_content.User', 'user')
      // .where('user.block_user_id=:blockUserId', { blockUserId: null })
      // .leftJoinAndSelect(Block, 'block', 'user.user_id=block.user_id')
      // .where('user.id=:userId', { userId })
      .select(['chat_content', 'user.username'])
      .getMany();
    if (contents) {
      // console.log('contents', contents);
    }
    if (Blockedusers.length > 0) {
      for (let i = 0; i < contents.length; i++) {
        for (let j = 0; j < Blockedusers.length; j++) {
          // console.log('content.userId:', content.userId);
          // content.userId !== Blockedusers[0].blockedUserId;
          if (contents[i].userId === Blockedusers[j].blockedUserId) {
            // console.log('user.blockedUserId:', Blockedusers[j].blockedUserId);
            contents.splice(i, 1);
            i--;
          }
        }
      }
    }
    // console.log(`chat content of chatroom id: ${chatroomId}`, contents);
    return contents;
  }

  async postContents(userId: number, chatroomId: number, content: string) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);

    if (member.mutedAt !== null) {
      return;
    }
    const newContent = this.chatContentRepository.create({
      userId,
      chatroomId,
      content,
      User: user,
      Chatroom: chatroom,
    });
    await this.chatContentRepository.save(newContent);
    newContent['username'] = user.username;
    this.chatEventsGateway.server.emit('newContent', newContent);
    // return newContent;
  }
}
