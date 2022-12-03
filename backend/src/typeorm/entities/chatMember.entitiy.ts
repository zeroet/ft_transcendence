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
    type: 'number',
    description: 'chatroom member id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_member_id' })
  id: number;

  @ApiProperty({
    type: 'number',
    description: 'user id',
  })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({
    type: 'number',
    description: 'chatroom id',
  })
  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @ApiProperty({
    description: 'muted time',
  })
  @Column({
    type: 'timestamp',
    name: 'muted_at',
    nullable: true,
    default: null,
  })
  mutedAt: Date | null;

  @ApiProperty({
    description: 'blocked time',
  })
  @Column({
    type: 'timestamp',
    name: 'blocked_at',
    nullable: true,
    default: null,
  })
  blockedAt: Date | null;

  @ApiProperty({
    description: 'created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: false })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'created time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at', select: false })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, (Chatroom) => Chatroom.ChatMember)
  @JoinColumn({ name: 'chatroom_id', referencedColumnName: 'id' })
  Chatroom: IChatroom;

  @ManyToOne((type) => User, (User) => User.ChatMember)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
