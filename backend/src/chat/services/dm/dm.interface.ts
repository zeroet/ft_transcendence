export interface IDmService {
  getDmList(senderId: number);
  createDm(senderId: number, receiverId: number);
  getMembers(senderId: number, receiverId: number);
  getContents(senderId: number, receiverId: number);
  postContents(senderId: number, receiverId: number, content: string);
}
