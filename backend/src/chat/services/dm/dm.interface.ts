export interface IDmService {
  createDm(senderId: number, receiverId: number);
  getMembers(dmId: number);
  getContents(userId: number, dmId: number);
  postContents(senderId: number, receiverId: number, content: string);
}
