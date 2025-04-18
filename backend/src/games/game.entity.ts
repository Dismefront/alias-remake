import { Lobby } from 'src/lobbies/lobby.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameStats } from './game-stats.entity';
import { Recording } from 'src/data/recordings.entity';

@Entity('is_cw_game')
export class Game {
  @PrimaryGeneratedColumn()
  game_id: number;

  @ManyToOne(() => Lobby, (lobby) => lobby.games, { nullable: true })
  @JoinColumn({ name: 'winner_lobby_id' })
  winner_lobby: Lobby;

  @ManyToOne(() => Lobby, (lobby) => lobby.games)
  @JoinColumn({ name: 'lobby_id' })
  lobby: Lobby;

  @OneToOne(() => GameStats, (gameStats) => gameStats.game)
  @JoinColumn({ name: 'game_stats_id' })
  game_stats: GameStats;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @OneToMany(() => Recording, (recording) => recording.game_id)
  recordings: Recording[];
}
