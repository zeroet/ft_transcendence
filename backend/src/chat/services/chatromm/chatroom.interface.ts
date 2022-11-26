import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { User } from 'src/utils/decorators/user.decorator';

export interface IChatroomService {
  getAllChatrooms();
  createChatroom(user_id: number, createChatroomDto: CreateChatroomDto);
  getOneChatroom();
  updateChatroom();
  getMessages();
  postMessages();
  getAllMembers();
  postMembers();
}
