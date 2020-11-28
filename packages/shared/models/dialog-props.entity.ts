import { Column, Entity, ManyToOne } from 'typeorm';

import { DIALOG_USER_ROLES, MESSAGE_STATUSES } from 'shared/graphql';
import { BaseEntity, Dialog, User } from '.';

@Entity()
export class DialogProps extends BaseEntity {
  @ManyToOne(() => User, (user) => user.dialogsProps)
  user: User;

  @ManyToOne(() => Dialog, (dialog) => dialog.dialogProps)
  dialog: Dialog;

  @Column()
  userRole: DIALOG_USER_ROLES;

  @Column({ type: 'int' })
  unreadMessages: number;

  @Column({ nullable: true })
  lastMessageStatus?: MESSAGE_STATUSES;
}
