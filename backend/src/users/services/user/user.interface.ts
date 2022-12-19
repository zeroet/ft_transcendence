import { Status, UserDetails } from 'src/utils/types';

export interface IUserService {
  getCurrentUser(userId: number);
  getUserById(userId: number);
  getAllUsers();
  blockUser(userId: number, blockUserId: number);
  unBlockUser(userId: number, unBlockUserId: number);
  getBlockList(userId: number);
  addFriend(userId: number, friendUserId: number);
  deleteFriend(userId: number, unFriendUserId: number);
  getFriendList(userId: number);
  validateUser(userDetails: UserDetails);
  // createUser(userDetails: UserDetails);
  createDummyUser();
  deleteDummyUser(user);
  updateUserStatus(userId: number, status: Status);
  getMatch(userId: number);
  getRank(userId: number);
  // updateUserById(id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
