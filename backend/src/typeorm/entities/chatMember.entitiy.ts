import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { IChatMember } from '../interfaces/IChatMemeber';

@Entity({ name: 'chat_member' })
export class ChatMember implements IChatMember {
  @Column()
  user_id: number;

  @Column()
  chatroom_id: number;

  @Column()
  muted_date: Date;

  @Column()
  ban_date: Date;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly modified_at: Date;
}
