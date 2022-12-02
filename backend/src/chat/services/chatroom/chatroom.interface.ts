import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';

export interface IChatroomService {
  getAllChatrooms(): Promise<ChatroomDto[]>;
  createChatroom(
    userId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto>;
  getOneChatroom(chatroomId: number): Promise<ChatroomDto>;
  verifyChatroomPassword(chatroomId: number, password: string);
  getAllMembers(chatroomId: number);
  postMembers(userId: number, chatroomId: number);
  deleteMembers(userId: number, chatroomId: number);
  // updateChatroom();
  getContents();
  postContents();
}
