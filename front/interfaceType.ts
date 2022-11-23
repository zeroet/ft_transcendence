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
