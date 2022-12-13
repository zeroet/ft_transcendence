import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from 'src/typeorm';

export class UserDto extends OmitType(User, [
  'created_at',
  'modified_at',
  'hashed_refresh_token',
  // 'ChatMember',
  // 'ChatContent',
  // 'DmUser1',
  // 'DmUser2',
]) {
  // id: number;
  // intra_id: string;
  // email: string;
  // image_url: string;
  // username: string;
  // two_factor_activated: boolean;
  // two_factor_secret: string;
  // two_factor_valid: boolean;
}
