import { Game } from 'src/games/game.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('is_cw_recordings')
export class Recording {
  @PrimaryGeneratedColumn()
  recording_id: number;

  @ManyToOne(() => Game, (game) => game.recordings)
  @JoinColumn({ name: 'game_id' })
  game_id: Game;

  @Column()
  recording_key: string;

  @ManyToOne(() => User, (user) => user.recordings)
  @JoinColumn({ name: 'user_id' })
  user_id: User;
}
