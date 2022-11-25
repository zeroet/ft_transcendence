import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatroom } from '../interfaces/IChatroom';

@Entity({ name: 'chatroom' })
export class Chatroom implements IChatroom {
  @PrimaryGeneratedColumn()
  chatroom_id: number;

  @Column()
  owner_id: number;

  @Column({ unique: true, nullable: false, length: 30 })
  chatroom_name: string;

  @Column({ default: null, nullable: true, length: 30 })
  password: string;

  @Column()
  max_member_num: number;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly modified_at: Date;
}
