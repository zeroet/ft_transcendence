export type UserDetails = {
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export enum Cookies {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export const StatusArray = [
  'Login',
  'Logout',
  'Playing',
  'Game',
  'watching',
  'ready',
];

export enum Status {
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  PLAYING = 'Playing',
  GAME = 'Game',
  WATCHING = 'watching',
  READY = 'ready',
}
