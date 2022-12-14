import { IChatContent } from './IChatContent';
import { IChatMember } from './IChatMemeber';

export interface IChatroom {
  id: number;
  ownerId: number;
  adminId: number;
  chatroomName: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
  // ChatMember: IChatMember[];
  // ChatContent: IChatContent[];
}
