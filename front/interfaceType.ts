export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  created_at: string;
  email: string;
  id: number;
  image_url: string;
  modified_at: string;
  username: string;
  nickname: string;
}
