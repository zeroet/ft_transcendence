import { IChatroom } from './IChatroom';

export interface IChatContent {
  chatContentId: number;
  chatroomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Chatroom: IChatroom;
}
