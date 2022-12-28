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
import { IUser } from '../interfaces/IUser';
import { User } from './user.entity';

@Entity({ name: 'dm' })
export class Dm implements IDm {
  @PrimaryGeneratedColumn({ type: 'int', name: 'dm_id' })
  id: number;

  @Column({ type: 'int', name: 'user1', nullable: true })
  user1: number;

  @Column({ type: 'int', name: 'user2', nullable: true })
  user2: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @ManyToOne((type) => User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user1', referencedColumnName: 'id' })
  User1: IUser;

  @ManyToOne((type) => User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user2', referencedColumnName: 'id' })
  User2: IUser;
}
