import { IChatroom } from './IChatroom';
import { IUser } from './IUser';

export interface IChatParticipant {
  id: number;
  userId: number;
  isAdmin: boolean;
  chatroomId: number;
  mutedAt: Date;
  createdAt: Date;
  modifiedAt: Date;
  Chatroom: IChatroom;
  User: IUser;
}
