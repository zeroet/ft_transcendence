import { IBlock } from '../interfaces/IBlock';
import { IUser } from '../interfaces/IUser';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'block' })
export class Block implements IBlock {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'Block id for primary key',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'block_id' })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'User id',
  })
  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @ApiProperty({
    type: Number,
    description: 'Blocked user id',
  })
  @Column({
    type: 'int',
    name: 'blocked_user_id',
    nullable: true,
    default: null,
  })
  blockedUserId: number;

  @ApiProperty({
    description: 'Created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne((type) => User, (User) => User.Block, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'blocked_user', referencedColumnName: 'id' })
  BlockedUser: IUser;
}
