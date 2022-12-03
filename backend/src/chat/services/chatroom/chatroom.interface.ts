import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';

export interface IChatroomService {
  getAllChatrooms(): Promise<ChatroomDto[]>;
  createChatroom(
    userId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto>;
  getOneChatroom(chatroomId: number): Promise<ChatroomDto>;
  verifyChatroomPassword(chatroomId: number, password: string);
  updateChatroomInfo(
    userId: number,
    chatroomId: number,
    updateChatroomDto: UpdateChatroomDto,
  );
  getAllMembers(chatroomId: number);
  postMembers(userId: number, chatroomId: number);
  updateMemberInfo(
    userId: number,
    chatroomId: number,
    updateMemberDto: UpdateMemberDto,
  );
  deleteMembers(userId: number, chatroomId: number);
  getContents(chatroomId: number);
  postContents(userId: number, chatroomId: number, content: string);
}
