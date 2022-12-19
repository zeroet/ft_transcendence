import { PickType } from '@nestjs/swagger';
import { User } from 'src/typeorm';
export class UpdateUserStatusDto extends PickType(User, ['status']) {}
