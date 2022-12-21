export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
}

export enum Status {
  LOGIN = "Login",
  LOGOUT = "Logout",
  PLAYING = "Playing",
  GAME = "Game",
  WATCHING = "watching",
  READY = "ready",
}

export interface UserInfo {
  id: number;
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
  status: Status;
  created_at: Date;
  modified_at: Date;
  hashed_refresh_token: string;
  two_factor_activated: boolean;
  two_factor_secret: string;
  two_factor_valid: boolean;
}

export interface infoOfHistory {
  winer: string;
  loser: string;
  winnerScore: number;
  loserSocre: number;
  username: string;
}

export interface XYType {
  x: number;
  y: number;
}

export interface IChatroom {
  id: number;
  ownerId: number;
  adminIds: number[];
  chatroomName: string;
  isPrivate: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IChatMember {
  id: number;
  userId: number;
  chatroomId: number;
  // mutedAt: Date;
  createdAt: Date;
  modifiedAt: Date;
  User: {
    username: string;
  };
}

export interface IChatParticipant {
  id: number;
  userId: number;
  chatroomId: number;
  mutedAt: Date;
  bannedAt: Date;
  createdAt: Date;
  modifiedAt: Date;
  isAdmin: boolean;
  Chatroom: IChatroom;
  User: {
    username: string;
  };
}

export interface IChatContent {
  id: number;
  chatroomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  User: {
    username: string;
  };
}

export interface IDm {
  id: number;
  user1: number;
  user2: number;
  createdAt: Date;
  modifiedAt: Date;
  // User1: IUser;
  // User2: IUser;
  // DmContent: IDmContent[];
}

export interface IDmContent {
  id: number;
  dmId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Dm: IDm;
  // User: IUser;
}

export interface IFriend {
  id: number;
  userId: number;
  friendUserId: number;
  friendUsername: string;
  createdAt: Date;
  // User: UserInfo;
  // FriendUser: UserInfo;
}

export interface IBlock {
  id: number;
  userId: number;
  blockedUserId: number;
  createdAt: Date;
  // User: UserInfo;
  // BlockedUser: UserInfo;
}

export interface GameDTO {
  Players: Array<any>;
  roomName: string;
  ownerId: string;
  speed: string;
  ballSize: string;
}

export interface TypeChatId {
  id: string;
  link: string;
}
