import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatContent } from '../interfaces/IChatContent';
import { IChatroom } from '../interfaces/IChatroom';
import { Chatroom } from './chatroom.entity';

@Entity({ name: 'chat_content' })
export class ChatContent implements IChatContent {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chat_content_id' })
  chatContentId: number;

  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', name: 'content', nullable: false, length: 100 })
  content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, (Chatroom) => Chatroom.ChatContent)
  @JoinColumn()
  Chatroom: IChatroom;
}
