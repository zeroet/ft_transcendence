import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 30 })
  intra_id: string;

  @Column({ unique: true, nullable: false, length: 30 })
  email: string;

  @Column()
  image_url: string;

  @Column({ nullable: false, length: 30 })
  username: string;

  @Column({ default: null, nullable: true, length: 30 })
  nickname: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  modified_at: Date;

  // @Column({ nullable: true })
  // hashed_refresh_token: string;

  // @Column()
  // two_factor: boolean;
}
