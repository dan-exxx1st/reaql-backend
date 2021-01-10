import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity, User } from '.';

@Entity()
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  token: string;

  @Column({ type: 'bigint' })
  expiresIn: number;
}
