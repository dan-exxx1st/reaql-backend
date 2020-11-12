import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
    @PrimaryColumn()
    id: string;

    @Column()
    text: string;

    @Column({ default: false })
    done: boolean;
}
