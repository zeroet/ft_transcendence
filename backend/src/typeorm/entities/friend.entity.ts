import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne((type) => User, (User) => User.Friend, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'friend_user', referencedColumnName: 'id' })
  FriendUser: IUser;
}
