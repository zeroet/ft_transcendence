export interface IUserService {
  getCurrentUser(id: number);
  getUserById(id: number);
  getAllUsers();
  blockUser(userId: number, blockUserId: number);
  unBlockUser(userId: number, unBlockUserId: number);
  getBlockList(userId: number);
  addFriend(userId: number, friendUserId: number);
  deleteFriend(userId: number, unFriendUserId: number);
  getFriendList(userId: number);
  // updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
