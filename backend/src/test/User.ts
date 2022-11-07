import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
}