import { IUser } from './IUser';

export interface IFriend {
  id: number;
  userId: number;
  friendUserId: number;
  friendUsername: string;
  createdAt: Date;
  // modifiedAt: Date;
  User: IUser;
  FriendUser: IUser;
}
