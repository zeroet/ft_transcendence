export interface IDmService {
  getDmList(senderId: number, receiverId: number);
  createDm(senderId: number, receiverId: number);
  // getMembers(senderId: number, receiverId: number);
  getContents(senderId: number, dmId: number);
  postContents(
    senderId: number,
    // receiverId: number,
    dmId: number,
    content: string,
  );
  getUnreads(userId: number, senderId: number, after: number);
}
