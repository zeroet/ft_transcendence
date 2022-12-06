export interface IDmService {
  getMembers(dmId: number);
  postMembers(userId: number, dmId: number);
  getContents(userId: number, dmId: number);
  postContents(userId: number, dmId: number, content: string);
}
