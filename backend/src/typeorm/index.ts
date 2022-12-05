import { Block } from './entities/block.entity';
import { ChatContent } from './entities/chatContent.entity';
import { ChatMember } from './entities/chatMember.entitiy';
import { Chatroom } from './entities/chatroom.entity';
import { Dm } from './entities/dm.entity';
import { Friend } from './entities/friend.entity';
import { User } from './entities/user.entity';

export const entities = [
  User,
  Block,
  Friend,
  Chatroom,
  ChatMember,
  ChatContent,
  Dm,
];

export { User, Block, Friend, Chatroom, ChatMember, ChatContent, Dm };
