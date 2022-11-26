import {
  Column,
  CreateDateColumn,
  Entity,
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

@Entity({ name: 'chat_member' })
export class ChatMember implements IChatMember {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @Column({ type: 'timestamp', name: 'muted_date' })
  mutedDate: Date;

  @Column({ type: 'timestamp', name: 'ban_date' })
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
