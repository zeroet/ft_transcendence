import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IDm } from '../interfaces/IDm';
import { IDmContent } from '../interfaces/IDmContent';
import { IUser } from '../interfaces/IUser';
import { DmContent } from './dmContent.entity';
import { User } from './user.entity';

@Entity({ name: 'dm' })
export class Dm implements IDm {
  @PrimaryGeneratedColumn({ type: 'int', name: 'dm_id' })
  id: number;

  @Column({ type: 'int', name: 'user1', nullable: true })
  user1: number;

  @Column({ type: 'int', name: 'user2', nullable: true })
  user2: number;

  // @Column({ type: 'varchar', name: 'content', nullable: true, length: 100 })
  // content: string;

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

  // @OneToMany((type) => DmContent, (DmContent) => DmContent.Dm)
  // DmContent: IDmContent[];
}
