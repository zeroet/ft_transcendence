import { IUser } from './IUser';

export interface IBlock {
  id: number;
  userId: number;
  blockedUserId: number;
  createdAt: Date;
  User: IUser;
  BlockedUser: IUser;
}
