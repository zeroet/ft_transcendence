import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IFriend } from '../interfaces/IFriend';

@Entity()
export class Friend implements IFriend {
  @PrimaryGeneratedColumn({ type: 'int', name: 'friend_id' })
  friendId: number;

  @Column({ type: 'int', name: 'requester_id' })
  requesterId: number;

  @Column({ type: 'int', name: 'responser_id' })
  responserId: number;

  @Column({ type: 'boolean', name: 'approval' })
  approval: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  modifiedAt: Date;
}
