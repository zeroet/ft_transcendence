import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IDm } from '../interfaces/IDm';
import { IDmContent } from '../interfaces/IDmContent';
import { IUser } from '../interfaces/IUser';
import { Dm } from './dm.entity';
import { User } from './user.entity';

@Entity({ name: 'dm_content' })
export class DmContent implements IDmContent {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chat_content_id' })
  @ApiProperty({
    type: Number,
    description: 'Dm content id',
  })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'Dm id',
  })
  @Column({ type: 'int', name: 'dm_id' })
  dmId: number;

  @ApiProperty({
    type: Number,
    description: 'User id',
  })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({
    type: String,
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

  @ManyToOne((type) => Dm, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'dm', referencedColumnName: 'id' })
  Dm: IDm;

  @ManyToOne((type) => User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
