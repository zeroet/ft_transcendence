import { Block } from './entities/block.entity';
import { ChatContent } from './entities/chatContent.entity';
import { ChatMember } from './entities/chatMember.entitiy';
import { ChatParticipant } from './entities/chatParticipant.entity';
import { Chatroom } from './entities/chatroom.entity';
import { Dm } from './entities/dm.entity';
import { DmContent } from './entities/dmContent.entity';
import { Friend } from './entities/friend.entity';
import { MatchHistory } from './entities/matchHistory.entity';
import { User } from './entities/user.entity';

export const entities = [
  User,
  Block,
  Friend,
  Chatroom,
  ChatMember,
  ChatParticipant,
  ChatContent,
  Dm,
  DmContent,
  MatchHistory,
];

export {
  User,
  Block,
  Friend,
  Chatroom,
  ChatMember,
  ChatParticipant,
  ChatContent,
  Dm,
  DmContent,
  MatchHistory,
};
