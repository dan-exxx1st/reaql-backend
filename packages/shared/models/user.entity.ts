import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    password: string;

    @Column()
    avatar: string;
}
