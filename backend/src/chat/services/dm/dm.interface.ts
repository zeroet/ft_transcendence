export interface IDmService {
  getDmList();
  createDm(senderId: number, receiverId: number);
  getOneDm(dmId: number);
  getMembers(dmId: number);
  getContents(senderId: number, dmId: number);
  postContents(senderId: number, dmId: number, content: string);
  getUnreads(userId: number, senderId: number, after: number);
}
