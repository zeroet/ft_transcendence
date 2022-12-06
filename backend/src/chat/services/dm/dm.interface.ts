export interface IDmService {
  getDmList();
  createDm(senderId: number, receiverId: number);
  getOneDm(dmId: number);
  getMembers(dmId: number);
  // postMembers(userId: number, dmId: number);
  getContents(senderId: number, dmId: number);
  postContents(
    senderId: number,
    // receiverId: number,
    dmId: number,
    content: string,
  );
  getUnreads(userId: number, senderId: number, after: number);
}
