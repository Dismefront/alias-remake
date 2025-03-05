import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('is_cw_user_block')
export class UserBlock {
  @PrimaryGeneratedColumn()
  block_id?: number;

  @Column()
  cause: string;

  @ManyToOne(() => User, (user) => user.blocks)
  @JoinColumn({ name: 'blocked_by' })
  blocked_by: User;

  @ManyToOne(() => User, (user) => user.blocks)
  @JoinColumn({ name: 'blocked_user' })
  blocked_user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;
}
