import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity, Dialog, User } from '.';
import { MESSAGE_STATUSES } from 'shared/graphql';

@Entity()
export class Message extends BaseEntity {
  @ManyToOne(() => Dialog, (dialog) => dialog.messages)
  dialog: Dialog;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column()
  text: string;

  @Column({ type: 'timestamp' })
  messageDate: Date;

  @Column()
  messageStatus: MESSAGE_STATUSES;
}
