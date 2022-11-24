import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IDm } from '../interfaces/IDm';

@Entity({ name: 'dm' })
export class Dm implements IDm {
  @PrimaryGeneratedColumn()
  dm_id: number;

  @Column({ nullable: false })
  sender_id: number;

  @Column({ nullable: false })
  receiver_id: number;

  @Column({ nullable: false, length: 100 })
  content: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly modified_at: Date;
}
