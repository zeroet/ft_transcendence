import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatroom } from '../interfaces/IChatroom';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'chatroom' })
export class Chatroom implements IChatroom {
  @ApiProperty({
    type: Number,
    description: 'chatroom id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_id' })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'owner id',
  })
  @Column({ type: 'int', name: 'owner_id' })
  ownerId: number;

  @ApiProperty({
    description: 'admin ids',
  })
  @Column('int', { array: true, name: 'admin_ids', default: [] })
  adminIds: number[];

  @ApiProperty({
    type: String,
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
    type: String,
    description: 'password',
  })
  @Column({
    type: 'varchar',
    name: 'password',
    default: null,
    nullable: true,
    select: false,
    length: 100,
  })
  password: string;

  @ApiProperty({
    description: 'created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: false })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'modified time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at', select: false })
  readonly modifiedAt: Date;
}
