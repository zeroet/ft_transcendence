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

  @ApiProperty({
    required: true,
    example: 'jungmoo cheon',
    description: 'Friend Username',
  })
  @Column({
    type: 'varchar',
    name: 'friend_username',
    nullable: false,
    unique: true,
    length: 30,
  })
  friendUsername: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  // @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  // modifiedAt: Date;

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
