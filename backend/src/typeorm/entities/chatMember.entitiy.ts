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

@Index('user_id', ['userId'], {})
@Entity({ name: 'chat_member' })
export class ChatMember implements IChatMember {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_member_id' })
  chatroomMemberId: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @Column({ type: 'timestamp', name: 'muted_date', nullable: true })
  mutedDate: Date;

  @Column({ type: 'timestamp', name: 'ban_date', nullable: true })
  banDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, (Chatroom) => Chatroom.ChatMember)
  @JoinColumn({ name: 'chatroom_id', referencedColumnName: 'chatroomId' })
  Chatroom: IChatroom;

  @ManyToOne((type) => User, (User) => User.ChatMember)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
