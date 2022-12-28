import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatMember } from '../interfaces/IChatMemeber';
import { IChatroom } from '../interfaces/IChatroom';
import { IUser } from '../interfaces/IUser';
import { Chatroom } from './chatroom.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index('user_id', ['userId'], {})
@Entity({ name: 'chat_member' })
export class ChatMember implements IChatMember {
  @ApiProperty({
    type: Number,
    description: 'Chatroom member id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_member_id' })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'User id',
  })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({
    type: Number,
    description: 'Chatroom id',
  })
  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @ApiProperty({
    description: 'Created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: false })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Modified time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at', select: false })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'chatroom_id', referencedColumnName: 'id' })
  Chatroom: IChatroom;

  @ManyToOne((type) => User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
