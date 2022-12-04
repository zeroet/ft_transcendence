import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { IChatroom } from 'src/typeorm/interfaces/IChatroom';
import { DataSource, Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';
import * as bcrypt from 'bcrypt';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';

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

  async getAllChatrooms(): Promise<ChatroomDto[]> {
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
    this.chatEventsGateway.server.emit('newRoomList', 'chatroom created');
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
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    // const user = await this.findUserByIdOrFail(userId);

    if (chatroom.ownerId !== member.userId) {
      throw new UnauthorizedException(
        `No permission for User ${member.User.username}`,
      );
    }
    const updatedChatroom = await this.chatroomRepository.update(chatroomId, {
      chatroomName: updateChatroomDto.chatroomName,
      password: updateChatroomDto.password,
    });
    console.log('updated chatroom:', updatedChatroom);
    return updatedChatroom;
  }

  async getAllMembers(chatroomId: number) {
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
    // const member = await this.chatMemebrRepository
    //   .createQueryBuilder('chat_member')
    //   .where('chat_member.chatroom_id=:chatroomId', { chatroomId })
    //   .andWhere('chat_member.user_id=:userId', { userId })
    //   .getOne();
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
    await this.chatMemebrRepository.save(newMember);
    this.chatEventsGateway.server.emit('newMemberList', 'member list changed');
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
    // const targetUser = await this.chatMemebrRepository
    //   .createQueryBuilder('chat_member')
    //   .where('chat_member.chatroom_id = :chatroomId', { chatroomId })
    //   .andWhere('chat_member.user_id = :targetUserId', {
    //     targetUserId: updateMemberDto.targetUserId,
    //   })
    //   .getOne();
    // if (!targetUser) {
    //   throw new BadRequestException(
    //     `User of id:${updateMemberDto.targetUserId} doesn't exist in the chatroom of id:${chatroomId}`,
    //   );
    // }
    let updatedMember = null;
    // owner
    if (member.userId === chatroom.ownerId) {
      // mute
      if (updateMemberDto.mute === true) {
        updatedMember = await this.chatMemebrRepository.update(
          updateMemberDto.targetUserId,
          {
            mutedAt: new Date(),
          },
        );
      }
      // kick
      else if (updateMemberDto.kick === true) {
        return await this.deleteMembers(
          updateMemberDto.targetUserId,
          chatroomId,
        );
      }
      // ban
      else if (updateMemberDto.ban === true) {
        updatedMember = await this.chatMemebrRepository.update(
          updateMemberDto.targetUserId,
          {
            bannedAt: new Date(),
          },
        );
      }
      // block
      if (updateMemberDto.block === true) {
        // updatedMember = await this.chatMemebrRepository.update(
        //   updateMemberDto.targetUserId,
        //   {
        //     bannedAt: new Date(),
        //   },
        // );
      }
    }
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
    // const targetUser = await this.chatMemebrRepository
    //   .createQueryBuilder('chat_member')
    //   .where('chat_member.chatroom_id = :chatroomId', { chatroomId })
    //   .andWhere('chat_member.user_id = :targetUserId', {
    //     targetUserId,
    //   })
    //   .getOne();
    // if (!targetUser) {
    //   throw new BadRequestException(
    //     `User of id:${targetUserId} doesn't exist in the chatroom of id:${chatroomId}`,
    //   );
    // }
    // owner
    if (member.userId !== chatroom.ownerId) {
      throw new BadRequestException(
        `User of id:${userId} is not an owner of chatroom of id:${chatroomId}`,
      );
    }
    // set ad admin
    const updatedChatroom = await this.chatroomRepository.update(userId, {
      ownerId: targetUserId,
    });
    console.log('updated chatroom owner:', updatedChatroom);
    return updatedChatroom;
  }

  async deleteMembers(userId: number, chatroomId: number) {
    await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    // const member = await this.chatMemebrRepository
    //   .createQueryBuilder('chat_member')
    //   .where('chat_member.chatroom_id=:chatroomId', { chatroomId })
    //   .andWhere('chat_member.user_id=:userId', { userId })
    //   .getOne();
    // if (!member)
    //   throw new BadRequestException(
    //     `User of id:${userId} not exists in chatroom of id:${chatroomId}`,
    //   );
    this.chatMemebrRepository.remove(member);
    this.chatEventsGateway.server.emit('newMemberList', 'member list changed');
  }

  async getContents(userId: number, chatroomId: number) {
    // const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    let contents = await this.chatContentRepository
      .createQueryBuilder('chat_content')
      .where('chat_content.chatroom_id=:chatroomId', { chatroomId })
      .innerJoinAndSelect('chat_content.User', 'user')
      // .where('user.block_user_id=:blockUserId', { blockUserId: null })
      .select(['chat_content', 'user.username', 'user.blockUserId'])
      .getMany();
    if (contents) {
      console.log('contents', contents);
    }
    contents = contents.filter(
      (content: any) => content.User.blockUserId === null,
    );
    console.log(`chat content of chatroom id: ${chatroomId}`, contents);
    return contents;
  }

  async postContents(userId: number, chatroomId: number, content: string) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    // const member = await this.chatMemebrRepository
    //   .createQueryBuilder('chat_member')
    //   .where('chat_member.user_id=:userId', { userId })
    //   .getOne();

    // if (!member) {
    //   throw new BadRequestException(
    //     `User of id:${userId} is not a member of chatroom of id:${chatroomId}`,
    //   );
    // }

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
    this.chatEventsGateway.server.emit('newContent', 'new content');
    // return newContent;
  }
}
