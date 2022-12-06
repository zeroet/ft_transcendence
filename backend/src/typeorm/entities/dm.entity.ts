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

  @Column({ type: 'int', name: 'sender_id', nullable: false })
  senderId: number;

  @Column({ type: 'int', name: 'receiver_id', nullable: false })
  receiverId: number;

  @Column({ type: 'varchar', name: 'content', nullable: true, length: 100 })
  content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  readonly modifiedAt: Date;

  @ManyToOne((type) => User, (User) => User.DmSender, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender', referencedColumnName: 'id' })
  Sender: IUser;

  @ManyToOne((type) => User, (User) => User.DmReceiver, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver', referencedColumnName: 'id' })
  Receiver: IUser;
}
