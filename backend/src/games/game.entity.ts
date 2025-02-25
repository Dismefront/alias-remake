import { Lobby } from 'src/lobbies/lobby.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameStats } from './game-stats.entity';
import { Recording } from 'src/data/recordings.entity';

@Entity('is_cw_game')
export class Game {
  @PrimaryGeneratedColumn()
  game_id: number;

  @ManyToOne(() => Lobby, (lobby) => lobby.games)
  @JoinColumn({ name: 'winner_lobby_id' })
  winner_lobby_id: Lobby;

  @ManyToOne(() => Lobby, (lobby) => lobby.games)
  @JoinColumn({ name: 'lobby_id' })
  lobby_id: Lobby;

  @ManyToOne(() => GameStats, (gameStats) => gameStats.games)
  @JoinColumn({ name: 'game_stats_id' })
  game_stats_id: GameStats;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @OneToMany(() => Recording, (recording) => recording.game_id)
  recordings: Recording[];
}
