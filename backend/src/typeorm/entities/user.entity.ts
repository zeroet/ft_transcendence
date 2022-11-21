import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from '../interfaces/IUser';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 30 })
  intra_id: string;

  @Column({ unique: true, nullable: false, length: 30 })
  email: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @Column({ nullable: false, length: 30 })
  username: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;

  @Column({ nullable: true })
  hashed_refresh_token: string;

  @Column({ default: false })
  two_factor: boolean;
}
