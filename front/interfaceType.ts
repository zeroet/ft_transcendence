export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
  created_at: Date;
  modified_at: Date;
  hashed_refresh_token: string;
  two_factor_activated: boolean;
  two_factor_secret: string;
  two_factor_valid: boolean;
}

export interface infoOfHistory {
  winOrLoss: string;
  firstPlayer: string;
  secondPlayer: string;
  point: string;
}

export interface XYType {
  x: number;
  y: number;
}

export interface IChatroom {
  chatroomId: number;
  ownerId: number;
  chatroomName: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IChatMember {
  userId: number;
  chatroomId: number;
  mutedDate: Date;
  banDate: Date;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IChatContent {
  chatContentId: number;
  chatroomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IDm {
  dmId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface GameDTO{
  Players: Array<any>;
  roomName: string;
  ownerId: string;
  speed: string;
  ballSize: string;
}
