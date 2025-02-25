import { Lobby } from 'src/lobbies/lobby.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('is_cw_messages')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sent_by' })
  sent_by: User;

  @ManyToOne(() => Lobby, (lobby) => lobby.messages)
  @JoinColumn({ name: 'lobby_id' })
  lobby_id: Lobby;
}
