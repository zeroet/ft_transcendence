import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { User } from 'src/utils/decorators/user.decorator';

export interface IChatroomService {
  getAllChatrooms();
  createChatroom(userId: number, createChatroomDto: CreateChatroomDto);
  getOneChatroom();
  updateChatroom();
  getMessages();
  postMessages();
  getAllMembers(chatroomId: number);
  postMembers(chatroomId: number);
}
