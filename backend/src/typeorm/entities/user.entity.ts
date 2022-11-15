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

  @Column()
  username: string;
}
