import { OmitType } from '@nestjs/swagger';
import { User } from 'src/typeorm';

export class UserDto extends OmitType(User, [
  'created_at',
  'modified_at',
  'hashed_refresh_token',
]) {}
