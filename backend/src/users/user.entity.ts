import { Message } from 'src/data/message.entity';
import { Recording } from 'src/data/recordings.entity';
import { Lobby } from 'src/lobbies/lobby.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBlock } from './user-block.entity';
import { GuessedWord } from 'src/words/guessed-word.entity';
import { Category } from 'src/categories/category.entity';
import { Word } from 'src/words/word.entity';

type Roles = 'DEFAULT' | 'ADMIN';
@Entity('is_cw_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ default: 'DEFAULT', enum: ['DEFAULT', 'ADMIN'] })
  role: Roles;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Lobby, (lobby) => lobby.created_by)
  lobbies: Lobby[];

  @OneToMany(() => UserBlock, (block) => block.blocked_by)
  blocks: UserBlock[];

  @OneToMany(() => Recording, (recording) => recording.user_id)
  recordings: Recording[];

  @OneToMany(() => Message, (message) => message.sent_by)
  messages: Message[];

  @OneToMany(() => GuessedWord, (guessedWord) => guessedWord.guessed_by)
  guessed_words: GuessedWord[];

  @OneToMany(() => Category, (created_category) => created_category.created_by)
  created_categories: Category[];

  @OneToMany(() => Word, (suggested_word) => suggested_word.suggested_by)
  suggested_words: Word[];
}
