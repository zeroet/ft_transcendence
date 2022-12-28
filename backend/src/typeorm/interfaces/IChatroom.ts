export interface IChatroom {
  id: number;
  ownerId: number;
  adminIds: number[];
  chatroomName: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}
