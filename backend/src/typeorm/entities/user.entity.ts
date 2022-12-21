import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { ApiProperty } from '@nestjs/swagger';
import { Block } from './block.entity';
import { IBlock } from '../interfaces/IBlock';
import { IFriend } from '../interfaces/IFriend';
import { Friend } from './friend.entity';
import { Status } from 'src/utils/types';
import { MatchHistory } from './matchHistory.entity';

@Entity({ name: 'users' })
export class User implements IUser {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'User id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  id: number;

  @ApiProperty({
    required: true,
    example: 'cjung-mo',
    description: 'Intra_id',
  })
  @Column({
    type: 'varchar',
    name: 'intra_id',
    unique: true,
    nullable: false,
    length: 30,
  })
  intra_id: string;

  @ApiProperty({
    required: true,
    example: 'cjung-mo@student.42.fr',
    description: 'User email',
  })
  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
    nullable: false,
    length: 30,
  })
  email: string;

  @ApiProperty({
    required: true,
    example:
      'https://cdn.intra.42.fr/users/a74759faaa286d38f1362d6638daf1c0/cjung-mo.jpg',
    description: 'User image_url',
  })
  @Column({ type: 'text', name: 'image_url', nullable: true })
  image_url: string;

  @ApiProperty({
    required: true,
    example: 'jungmoo cheon',
    description: 'Username',
  })
  @Column({
    type: 'varchar',
    name: 'username',
    unique: true,
    nullable: false,
    length: 30,
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'LOGIN',
    description:
      'User status: "LOGIN" or "LOGOUT" or "PLAYING" or "WATCHING" or "READY"',
  })
  @Column({
    type: 'varchar',
    name: 'status',
    nullable: false,
    default: Status.LOGOUT,
  })
  status: Status;

  @ApiProperty({
    description: 'Created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at' })
  modified_at: Date;

  @Column({
    type: 'varchar',
    name: 'hashed_refresh_token',
    nullable: true,
    select: false,
  })
  hashed_refresh_token: string;

  @ApiProperty({
    required: false,
    example: 'false',
    description: 'two_factor_activated',
  })
  @Column({ type: 'boolean', name: 'two_factor_activated', default: false })
  two_factor_activated: boolean;

  @ApiProperty({
    required: false,
    example: 'NUGQEHCBAAERQBQ6',
    description: 'two_factor_secret',
  })
  @Column({
    type: 'varchar',
    name: 'two_factor_secret',
    nullable: true,
    select: false,
  })
  two_factor_secret: string;

  @ApiProperty({
    required: false,
    example: 'false',
    description: 'two_factor_valid',
  })
  @Column({ type: 'boolean', name: 'two_factor_valid', default: false })
  two_factor_valid: boolean;

  @OneToMany((type) => Block, (Block) => Block.User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'block', referencedColumnName: 'id' })
  Block: IBlock[];

  @OneToMany((type) => Friend, (Friend) => Friend.User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'friend', referencedColumnName: 'id' })
  Friend: IFriend[];

  @OneToMany(() => MatchHistory, (match) => match.winner)
  won: MatchHistory[];

  @OneToMany(() => MatchHistory, (match) => match.loser)
  lost: MatchHistory[];
}
