import { IUser } from './IUser';

export interface IFriend {
  id: number;
  userId: number;
  friendUserId: number;
  createdAt: Date;
  User: IUser;
  FriendUser: IUser;
}
