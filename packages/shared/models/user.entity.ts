import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity, Message, Session, DialogProps } from '.';

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

  @Column()
  online?: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => DialogProps, (dialogProps) => dialogProps.user)
  dialogProps: DialogProps[];
}
