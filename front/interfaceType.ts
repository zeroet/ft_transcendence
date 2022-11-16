export interface TokenType {
  token?: string;
  refresh?: string;
}

export interface User {
  created_at: string;
  email: string;
  id: number;
  image_url: string;
  modified_at: string;
  username: string;
}