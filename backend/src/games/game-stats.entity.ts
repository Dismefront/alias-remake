import { GuessedWord } from 'src/words/guessed-word.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Game } from './game.entity';

@Entity('is_cw_gamestats')
export class GameStats {
  @PrimaryGeneratedColumn()
  game_stats_id: number;

  @Column({ default: 0 })
  guessed_word_count: number;

  @OneToMany(() => Game, (game) => game.game_stats_id)
  games: Game[];

  @OneToMany(() => GuessedWord, (guessedWord) => guessedWord.game_stats_id)
  guessed_words: GuessedWord[];
}
