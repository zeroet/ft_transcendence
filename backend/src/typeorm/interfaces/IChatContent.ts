import { IChatroom } from './IChatroom';
import { IUser } from './IUser';

export interface IChatContent {
  chatContentId: number;
  chatroomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Chatroom: IChatroom;
  User: IUser;
}
