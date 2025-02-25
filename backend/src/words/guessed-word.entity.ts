import { GameStats } from 'src/games/game-stats.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from './word.entity';
import { User } from 'src/users/user.entity';

@Entity('is_cw_guessed_word')
export class GuessedWord {
  @PrimaryGeneratedColumn()
  guessed_word_id: number;

  @ManyToOne(() => GameStats, (gameStats) => gameStats.guessed_words)
  @JoinColumn({ name: 'game_stats_id' })
  game_stats_id: GameStats;

  @ManyToOne(() => Word, (word) => word.guessed_words)
  @JoinColumn({ name: 'word_id' })
  word_id: Word;

  @ManyToOne(() => User, (user) => user.guessed_words)
  @JoinColumn({ name: 'guessed_by' })
  guessed_by: User;
}
