export interface IUserService {
  getCurrentUser(id: number);
  getUserById(id: number);
  getAllUsers();
  blockUser(userId: number, blockUserId: number);
  unBlockUser(userId: number, unBlockUserId: number);
  addFriend(userId: number, friendUserId: number);
  deleteFriend(userId: number, unFriendUserId: number);
  // updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
