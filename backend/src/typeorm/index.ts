import { ChatContent } from './entities/chatContent.entity';
import { ChatMember } from './entities/chatMember.entitiy';
import { Chatroom } from './entities/chatroom.entity';
import { Dm } from './entities/dm.entity';
import { User } from './entities/user.entity';

export const entities = [User, Chatroom, ChatMember, ChatContent, Dm];

export { User, Chatroom, ChatMember, ChatContent, Dm };
