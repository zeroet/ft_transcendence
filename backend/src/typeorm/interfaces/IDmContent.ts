import { IDm } from './IDm';
import { IUser } from './IUser';

export interface IDmContent {
  id: number;
  dmId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Dm: IDm;
  User: IUser;
}
