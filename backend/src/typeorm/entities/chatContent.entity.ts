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
import { IUser } from '../interfaces/IUser';
import { Chatroom } from './chatroom.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'chat_content' })
export class ChatContent implements IChatContent {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chat_content_id' })
  @ApiProperty({
    type: 'number',
    description: 'Chat content id',
  })
  id: number;

  @ApiProperty({
    type: 'number',
    description: 'Chatroom id',
  })
  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @ApiProperty({
    type: 'number',
    description: 'User id',
  })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({
    type: 'string',
    description: 'Content that a user entered',
  })
  @Column({ type: 'varchar', name: 'content', nullable: false, length: 100 })
  content: string;

  @ApiProperty({
    description: 'Created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Modified time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, (Chatroom) => Chatroom.ChatContent)
  @JoinColumn()
  Chatroom: IChatroom;

  @ManyToOne((type) => User, (User) => User.ChatContent)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
