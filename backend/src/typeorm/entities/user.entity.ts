import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatContent } from '../interfaces/IChatContent';
import { IChatMember } from '../interfaces/IChatMemeber';
import { IUser } from '../interfaces/IUser';
import { ChatContent } from './chatContent.entity';
import { ChatMember } from './chatMember.entitiy';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  id: number;

  @Column({
    type: 'varchar',
    name: 'intra_id',
    unique: true,
    nullable: false,
    length: 30,
  })
  intra_id: string;

  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
    nullable: false,
    length: 30,
  })
  email: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  image_url: string;

  @Column({
    type: 'varchar',
    name: 'username',
    unique: true,
    nullable: false,
    length: 30,
  })
  username: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  modified_at: Date;

  @Column({ type: 'varchar', name: 'hashed_refresh_token', nullable: true })
  hashed_refresh_token: string;

  @Column({ type: 'boolean', name: 'two_factor_activated', default: false })
  two_factor_activated: boolean;

  @Column({ type: 'varchar', name: 'two_factor_secret', nullable: true })
  two_factor_secret: string;

  @Column({ type: 'boolean', name: 'two_factor_valid', default: false })
  two_factor_valid: boolean;

  @OneToMany((type) => ChatMember, (ChatMember) => ChatMember.User)
  ChatMember: IChatMember[];

  @OneToMany((type) => ChatContent, (ChatContent) => ChatContent.User)
  ChatContent: IChatContent[];
}
