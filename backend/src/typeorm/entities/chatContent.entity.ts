import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatContent } from '../interfaces/IChatContent';

@Entity({ name: 'chat_content' })
export class ChatContent implements IChatContent {
  @PrimaryGeneratedColumn()
  chat_content_id: number;

  @Column()
  chatroom_id: number;

  @Column()
  user_id: number;

  @Column({ nullable: false, length: 100 })
  content: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly modified_at: Date;
}
