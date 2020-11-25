import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id)
  @Column()
  user: string;

  @Column()
  token: string;

  @Column({ type: 'bigint' })
  expiresIn: number;
}
