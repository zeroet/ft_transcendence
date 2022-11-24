export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  id: number;
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
  chatroom_id: number;
  owner_id: number;
  chatroom_name: string;
  password: string;
  max_member_num: number;
  created_at: Date;
  modified_at: Date;
}

export interface IChatContent {
  chat_content_id: number;
  chatroom_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  modified_at: Date;
}

export interface IChatMember {
  user_id: number;
  chatroom_id: number;
  muted_date: Date;
  ban_date: Date;
  created_at: Date;
  modified_at: Date;
}

export interface IDm {
  dm_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
  modified_at: Date;
}
