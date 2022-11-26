import { IChatroom } from './IChatroom';

export interface IChatMember {
  userId: number;
  chatroomId: number;
  mutedDate: Date;
  banDate: Date;
  createdAt: Date;
  modifiedAt: Date;
  Chatroom: IChatroom;
}
