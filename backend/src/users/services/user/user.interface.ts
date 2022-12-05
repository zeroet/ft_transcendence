export interface IUserService {
  getCurrentUser(id: number);
  getUserById(id: number);
  getAllUsers();
  blockUser(userId: number, blockUserId: number);
  unBlockUser(userId: number, unBlockUserId: number);
  // updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
