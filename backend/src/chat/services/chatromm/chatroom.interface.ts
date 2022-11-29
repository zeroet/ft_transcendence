import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';

export interface IChatroomService {
  getAllChatrooms();
  createChatroom(userId: number, createChatroomDto: CreateChatroomDto);
  getOneChatroom(chatroomId: number);
  updateChatroom();
  getContents();
  postContents();
  getAllMembers(chatroomId: number);
  postMembers(userId: number, chatroomId: number);
}
