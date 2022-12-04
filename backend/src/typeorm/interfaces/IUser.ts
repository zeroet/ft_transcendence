import { IChatContent } from './IChatContent';
import { IChatMember } from './IChatMemeber';

export interface IUser {
  id: number;
  blockUserId: number;
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
  ChatMember: IChatMember[];
  ChatContent: IChatContent[];
}
