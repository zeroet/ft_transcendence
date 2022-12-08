import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IFriend } from '../interfaces/IFriend';
import { IUser } from '../interfaces/IUser';
import { User } from './user.entity';

@Entity()
export class Friend implements IFriend {
  @PrimaryGeneratedColumn({ type: 'int', name: 'friend_id' })
  id: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'friend_user_id' })
  friendUserId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  // @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  // modifiedAt: Date;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
