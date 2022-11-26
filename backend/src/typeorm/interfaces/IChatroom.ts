import { IChatMember } from './IChatMemeber';

export interface IChatroom {
  chatroomId: number;
  ownerId: number;
  chatroomName: string;
  password: string;
  // maxMemberNum: number;
  createdAt: Date;
  modifiedAt: Date;
  ChatMember: IChatMember[];
}
