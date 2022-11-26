import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatContent } from '../interfaces/IChatContent';
import { IChatMember } from '../interfaces/IChatMemeber';
import { IChatroom } from '../interfaces/IChatroom';
import { ChatContent } from './chatContent.entity';
import { ChatMember } from './chatMember.entitiy';

@Entity({ name: 'chatroom' })
export class Chatroom implements IChatroom {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @Column({ type: 'int', name: 'owner_id' })
  ownerId: number;

  @Column({
    type: 'varchar',
    name: 'chatroom_name',
    unique: true,
    nullable: false,
    length: 30,
  })
  chatroomName: string;

  @Column({
    type: 'varchar',
    name: 'password',
    default: null,
    nullable: true,
    length: 30,
  })
  password: string;

  // @Column()
  // maxMemberNum: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @OneToMany((type) => ChatMember, (ChatMember) => ChatMember.Chatroom)
  ChatMember: IChatMember[];

  @OneToMany((type) => ChatContent, (ChatContent) => ChatContent.Chatroom)
  ChatContent: IChatContent[];
}
