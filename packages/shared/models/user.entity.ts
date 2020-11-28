import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity, DialogProps, Message, Session } from '.';

@Entity()
export class User extends BaseEntity {
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

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => DialogProps, (dialogProps) => dialogProps.user)
  dialogsProps: DialogProps[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
