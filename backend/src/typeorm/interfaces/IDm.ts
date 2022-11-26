import { IUser } from './IUser';

export interface IDm {
  dmId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Sender: IUser;
  Receiver: IUser;
}
