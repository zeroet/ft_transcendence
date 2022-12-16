import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';
import { UpdateParticipantDto } from 'src/chat/dto/update-participant.dto';

export interface IChatroomService {
  getChatrooms(): Promise<ChatroomDto[]>;
  createChatroom(
    userId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto>;
  getOneChatroom(chatroomId: number): Promise<ChatroomDto>;
  deleteChatroom(userId: number, chatroomId: number);
  verifyChatroomPassword(chatroomId: number, password: string);
  updateChatroomInfo(
    userId: number,
    chatroomId: number,
    updateChatroomDto: UpdateChatroomDto,
  );
  changeOwner(userId: number, chatroomId: number, targetUserId: number);
  setAdmin(
    userId: number,
    chatroomId: number,
    targetUserId: number,
    isAdmin: boolean,
  );
  getParticipants(chatroomId: number);
  postParticipants(userId: number, chatroomId: number);
  updateParticipantInfo(
    userId: number,
    chatroomId: number,
    updateParticipantDto: UpdateParticipantDto,
  );
  deleteParticipants(userId: number, chatroomId: number);
  getMembers(chatroomId: number);
  postMembers(userId: number, chatroomId: number);
  updateMemberInfo(
    userId: number,
    chatroomId: number,
    updateMemberDto: UpdateMemberDto,
  );
  deleteMembers(userId: number, chatroomId: number);
  getContents(userId: number, chatroomId: number);
  postContents(userId: number, chatroomId: number, content: string);
}
