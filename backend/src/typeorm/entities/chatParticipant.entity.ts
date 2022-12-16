import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatroom } from '../interfaces/IChatroom';
import { IUser } from '../interfaces/IUser';
import { Chatroom } from './chatroom.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IChatParticipant } from '../interfaces/IChatParticipant';

@Entity({ name: 'chat_participant' })
export class ChatParticipant implements IChatParticipant {
  @ApiProperty({
    type: Number,
    description: 'Chatroom participant id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_participant_id' })
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
    type: Boolean,
    description: 'if the user is an admin, its true',
  })
  @Column({ type: 'boolean', name: 'amdin', default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Muted time',
  })
  @Column({
    type: 'timestamp',
    name: 'muted_at',
    nullable: true,
    default: null,
  })
  mutedAt: Date | null;

  @ApiProperty({
    description: 'Banned time',
  })
  @Column({
    type: 'timestamp',
    name: 'banned_at',
    nullable: true,
    default: null,
  })
  bannedAt: Date | null;

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
