import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/events/chat.events.gateway';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import {
  Block,
  ChatContent,
  ChatMember,
  ChatParticipant,
  Chatroom,
  User,
} from 'src/typeorm';
import { IChatroom } from 'src/typeorm/interfaces/IChatroom';
import { Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';
import * as bcrypt from 'bcrypt';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpdateParticipantDto } from 'src/chat/dto/update-participant.dto';

@Injectable()
export class ChatroomService implements IChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(ChatMember)
    private chatMemebrRepository: Repository<ChatMember>,
    @InjectRepository(ChatParticipant)
    private chatParticipantRepository: Repository<ChatParticipant>,
    @InjectRepository(ChatContent)
    private chatContentRepository: Repository<ChatContent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private chatEventsGateway: ChatEventsGateway,
  ) {}

  async findUserByIdOrFail(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async findMemberById(userId: number, chatroomId: number) {
    const member = await this.chatMemebrRepository
      .createQueryBuilder('chat_member')
      .where('chat_member.chatroom_id = :chatroomId', { chatroomId })
      .andWhere('chat_member.user_id = :userId', { userId })
      .innerJoinAndSelect('chat_member.User', 'user')
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

  async findParticipantById(userId: number, chatroomId: number) {
    const participant = await this.chatParticipantRepository
      .createQueryBuilder('chat_participant')
      .where('chat_participant.chatroom_id = :chatroomId', { chatroomId })
      .andWhere('chat_participant.user_id = :userId', { userId })
      .innerJoinAndSelect('chat_participant.User', 'user')
      .getOne();
    return participant;
  }

  async findParticipantByIdOrFail(userId: number, chatroomId: number) {
    const participant = await this.findParticipantById(userId, chatroomId);
    if (!participant) {
      throw new NotFoundException(
        `User of id:${userId} doesn't participate in the chatroom of id:${chatroomId}`,
      );
    }
    return participant;
  }

  async findChatroomByIdOrFail(chatroomId: number) {
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_id=:chatroomId', { chatroomId })
      .getOne();
    if (!chatroom) {
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
      const targetUser = await this.findParticipantByIdOrFail(
        targetUserId,
        chatroomId,
      );
      if (targetUser) {
        if (timeoutName === `${targetUser.User.username}_banned`) {
          targetUser.bannedAt = null;
        } else if (timeoutName === `${targetUser.User.username}_muted`) {
          targetUser.mutedAt = null;
        }
      }
      await this.chatParticipantRepository.save(targetUser);
      this.schedulerRegistry.deleteTimeout(timeoutName);
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutName, timeout);
  }

  updateTimeout(
    timeoutName: string,
    targetUserId: number,
    chatroomId: number,
    milliseconds: number,
  ) {
    console.log(timeoutName);
    const callback = async () => {
      console.log(
        `update Timeout name: ${timeoutName} executing after ${milliseconds}`,
      );
      const targetUser = await this.findParticipantByIdOrFail(
        targetUserId,
        chatroomId,
      );
      if (targetUser) {
        if (timeoutName === `${targetUser.User.username}_banned`) {
          targetUser.bannedAt = null;
        } else if (timeoutName === `${targetUser.User.username}_muted`) {
          targetUser.mutedAt = null;
        }
      }
      await this.chatParticipantRepository.save(targetUser);
      this.schedulerRegistry.deleteTimeout(timeoutName);
    };
    this.schedulerRegistry.deleteTimeout(timeoutName);
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutName, timeout);
  }

  deleteTimeout(timeoutName: string) {
    this.schedulerRegistry.deleteTimeout(timeoutName);
    console.log('deleteTimeout:', timeoutName);
  }

  getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    if (timeouts) timeouts.forEach((key) => console.log(`Timout name: ${key}`));
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
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const { chatroomName, password } = createChatroomDto;
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name = :chatroomName', { chatroomName })
      .getOne();
    if (chatroom)
      throw new BadRequestException(
        `Chatroom of name: '${chatroomName}' already exists`,
      );
    const hashedPassword =
      password !== null
        ? await this.hashData(createChatroomDto.password)
        : null;
    const newChatroom = this.chatroomRepository.create({
      ownerId: userId,
      chatroomName,
      password: hashedPassword,
    });
    const createdChatroom = await this.chatroomRepository.save(newChatroom);
    this.chatEventsGateway.server.emit('newRoomList', createdChatroom);
    const result = await this.getChatroomsInfo([newChatroom]);
    return result[0];
  }

  async getOneChatroom(chatroomId: number): Promise<ChatroomDto> {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const result = await this.getChatroomsInfo([chatroom]);
    console.log(result[0]);
    return result[0];
  }

  async deleteChatroom(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const removedChatroom = await this.chatroomRepository.remove(chatroom);
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
    chatroom.password = hashedPassword;
    chatroom.chatroomName = chatroomName;
    const updatedChatroom = await this.chatroomRepository.save(chatroom);
    this.chatEventsGateway.server.emit('newRoomList', updatedChatroom);
    return updatedChatroom;
  }

  async changeOwner(userId: number, chatroomId: number, targetUserId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const targetUser = await this.findMemberByIdOrFail(
      targetUserId,
      chatroomId,
    );
    if (member.userId !== chatroom.ownerId) {
      throw new UnauthorizedException(
        `User of id:${userId} is not an owner of chatroom of id:${chatroomId}`,
      );
    }
    chatroom.ownerId = targetUserId;
    const updatedChatroom = await this.chatroomRepository.save(chatroom);
    this.chatEventsGateway.server.emit('newMemberList', updatedChatroom);
    return updatedChatroom;
  }

  async setAdmin(
    userId: number,
    chatroomId: number,
    targetUserId: number,
    isAdmin: boolean,
  ) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const targetUser = await this.findParticipantByIdOrFail(
      targetUserId,
      chatroomId,
    );
    if (member.userId !== chatroom.ownerId) {
      throw new UnauthorizedException(
        `User of id:${userId} is not an owner of chatroom of id:${chatroomId}`,
      );
    }
    targetUser.isAdmin = isAdmin;
    const updatedParticipant = await this.chatParticipantRepository.save(
      targetUser,
    );
    if (isAdmin) {
      chatroom.adminIds.push(targetUser.userId);
      await this.chatroomRepository.save(chatroom);
    } else {
      chatroom.adminIds = chatroom.adminIds.filter((adminId) => {
        return adminId !== targetUser.userId;
      });
      await this.chatroomRepository.save(chatroom);
    }
    this.chatEventsGateway.server.emit(
      'newParticipantList',
      updatedParticipant,
    );
    return updatedParticipant;
  }

  async getParticipants(chatroomId: number) {
    let participants = await this.chatParticipantRepository
      .createQueryBuilder('chat_participant')
      .innerJoin(
        'chat_participant.Chatroom',
        'chatroom',
        'chatroom.chatroom_id = :chatroomId',
        { chatroomId },
      )
      .innerJoinAndSelect('chat_participant.User', 'user')
      .select(['chat_participant', 'user.username', 'user.image_url'])
      .getMany();
    return participants;
  }

  async postParticipants(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const participant = await this.findParticipantById(userId, chatroomId);
    let isAdmin = false;
    if (participant) {
      return;
    }
    if (chatroom.ownerId === user.id) {
      isAdmin = true;
    }

    console.log('isAdmin:', isAdmin);
    const newParticipant = this.chatParticipantRepository.create({
      userId,
      isAdmin,
      chatroomId,
      Chatroom: chatroom,
      User: user,
    });
    const savedParticipant = await this.chatParticipantRepository.save(
      newParticipant,
    );
    if (isAdmin) {
      chatroom.adminIds.push(newParticipant.userId);
      await this.chatroomRepository.save(chatroom);
    }
    this.chatEventsGateway.server.emit('newParticipantList', savedParticipant);
    return savedParticipant;
  }

  async updateParticipantInfo(
    userId: number,
    chatroomId: number,
    updateParticipantDto: UpdateParticipantDto,
  ) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const participant = await this.findParticipantByIdOrFail(
      userId,
      chatroomId,
    );
    const targetUser = await this.findParticipantByIdOrFail(
      updateParticipantDto.targetUserId,
      chatroomId,
    );
    let updatedParticipant = null;
    if (!participant.isAdmin) {
      throw new UnauthorizedException(
        `Username:${participant.User.username} is not an admin of chatroom of name:${chatroom.chatroomName}`,
      );
    }
    if (targetUser.userId === chatroom.ownerId) {
      throw new UnauthorizedException(
        `No permission to ban or kick or mute owner of chatroom`,
      );
    }
    // ban
    if (updateParticipantDto.ban === true) {
      if (targetUser.bannedAt === null) {
        this.addNewTimeout(
          `${targetUser.User.username}_banned`,
          targetUser.userId,
          chatroomId,
          15000,
        );
      } else {
        console.log(
          'already banned update participant():',
          targetUser.bannedAt,
        );
        this.updateTimeout(
          `${targetUser.User.username}_banned`,
          targetUser.userId,
          chatroomId,
          15000,
        );
      }
      targetUser.bannedAt = new Date();
      updatedParticipant = await this.chatParticipantRepository.save(
        targetUser,
      );
      this.chatEventsGateway.server.emit('ban', {
        chatroomId: chatroomId,
        targetUserId: targetUser.userId,
      });
    }
    // mute
    else if (updateParticipantDto.mute === true) {
      if (targetUser.mutedAt === null) {
        this.addNewTimeout(
          `${targetUser.User.username}_muted`,
          targetUser.userId,
          chatroomId,
          15000,
        );
      } else {
        this.updateTimeout(
          `${targetUser.User.username}_muted`,
          targetUser.userId,
          chatroomId,
          15000,
        );
      }
      targetUser.mutedAt = new Date();
      updatedParticipant = await this.chatParticipantRepository.save(
        targetUser,
      );
      this.chatEventsGateway.server.emit('mute', {
        chatroomId: chatroomId,
        targetUserId: targetUser.userId,
      });
    }
    return updatedParticipant;
  }

  async deleteParticipants(userId: number, chatroomId: number) {
    await this.findChatroomByIdOrFail(chatroomId);
    const participant = await this.findParticipantByIdOrFail(
      userId,
      chatroomId,
    );
    const removedParticipant = await this.chatParticipantRepository.remove(
      participant,
    );
    this.chatEventsGateway.server.emit(
      'newParticipantList',
      removedParticipant,
    );
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
    return members;
  }

  async postMembers(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const member = await this.findMemberById(userId, chatroomId);
    if (member) {
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
    const savedMember = await this.chatMemebrRepository.save(newMember);
    this.chatEventsGateway.server.emit('newMemberList', savedMember);
    return this.postParticipants(userId, chatroomId);
  }

  async updateMemberInfo(
    userId: number,
    chatroomId: number,
    updateMemberDto: UpdateMemberDto,
  ) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const participant = await this.findParticipantByIdOrFail(
      userId,
      chatroomId,
    );
    const targetUser = await this.findMemberByIdOrFail(
      updateMemberDto.targetUserId,
      chatroomId,
    );
    let updatedMember = null;
    // admin verification
    if (!participant.isAdmin) {
      throw new UnauthorizedException(
        `Username:${participant.User.username} is not an admin of chatroom of name:${chatroom.chatroomName}`,
      );
    }
    if (targetUser.userId === chatroom.ownerId) {
      throw new UnauthorizedException(
        `No permission to kick owner of chatroom`,
      );
    }
    // kick
    if (updateMemberDto.kick === true) {
      this.chatEventsGateway.server.emit('kick', {
        chatroomId: chatroomId,
        targetUserId: targetUser.userId,
      });
    }
    return updatedMember;
  }

  async deleteMembers(userId: number, chatroomId: number) {
    await this.findChatroomByIdOrFail(chatroomId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const removedMember = await this.chatMemebrRepository.remove(member);
    this.chatEventsGateway.server.emit('newMemberList', removedMember);
  }

  async getContents(userId: number, chatroomId: number) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const Blockedusers = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .getMany();
    let contents = await this.chatContentRepository
      .createQueryBuilder('chat_content')
      .where('chat_content.chatroom_id=:chatroomId', { chatroomId })
      .innerJoinAndSelect('chat_content.User', 'user')
      .select(['chat_content', 'user.username'])
      .getMany();
    if (Blockedusers.length > 0) {
      for (let i = 0; i < contents.length; i++) {
        for (let j = 0; j < Blockedusers.length; j++) {
          if (contents[i].userId === Blockedusers[j].blockedUserId) {
            contents.splice(i, 1);
            i--;
          }
        }
      }
    }
    return contents;
  }

  async postContents(userId: number, chatroomId: number, content: string) {
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    const user = await this.findUserByIdOrFail(userId);
    const member = await this.findMemberByIdOrFail(userId, chatroomId);
    const newContent = this.chatContentRepository.create({
      userId,
      chatroomId,
      content,
      User: user,
      Chatroom: chatroom,
    });
    const savedNewContent = await this.chatContentRepository.save(newContent);
    newContent['username'] = user.username;
    this.chatEventsGateway.server.emit('newContent', newContent);
    return savedNewContent;
  }
}
