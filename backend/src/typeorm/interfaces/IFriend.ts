import { IUser } from './IUser';

export class IFriend {
  id: number;
  userId: number;
  friendUserId: number;
  createdAt: Date;
  // modifiedAt: Date;
  User: IUser;
}
