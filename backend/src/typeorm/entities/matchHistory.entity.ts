import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "./user.entity";


@Entity({name: 'matchhistory '})
export class MatchHistory {
    @ApiProperty({
        type: Number,
        description: 'id',
    })
    @PrimaryGeneratedColumn({type: 'int', name: 'match_id'})
    id: number;

    @Column('int', { array: true, default: [] })
    score: number[];
  
    @Column({ type: 'timestamptz' })
    date: Date;
  
    @ManyToOne((type) => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    winner: User;
  
    @ManyToOne((type) => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    loser: User;
}