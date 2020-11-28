import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity, DialogProps, Message, User } from '.';

@Entity()
export class Dialog extends BaseEntity {
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => DialogProps, (dialogProps) => dialogProps.dialog)
  dialogProps?: DialogProps[];

  @OneToMany(() => Message, (message) => message.dialog)
  messages: Message[];

  @Column({ nullable: true })
  lastMessage?: string;
  @Column({ nullable: true })
  lastMessageDate?: Date;
}
