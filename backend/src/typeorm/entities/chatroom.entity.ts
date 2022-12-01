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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'chatroom' })
export class Chatroom implements IChatroom {
  @ApiProperty({
    type: 'number',
    description: 'chatroom id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @ApiProperty({
    type: 'number',
    description: 'owner id',
  })
  @Column({ type: 'int', name: 'owner_id' })
  ownerId: number;

  @ApiProperty({
    type: 'string',
    description: 'chatroom name',
  })
  @Column({
    type: 'varchar',
    name: 'chatroom_name',
    unique: true,
    nullable: false,
    length: 30,
  })
  chatroomName: string;

  @ApiProperty({
    type: 'string',
    description: 'password',
  })
  @Column({
    type: 'varchar',
    name: 'password',
    default: null,
    nullable: true,
    length: 30,
  })
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @ApiProperty({
    type: 'string',
    description: 'modified time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @OneToMany((type) => ChatMember, (ChatMember) => ChatMember.Chatroom)
  ChatMember: IChatMember[];

  @OneToMany((type) => ChatContent, (ChatContent) => ChatContent.Chatroom)
  ChatContent: IChatContent[];
}
