import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GuessedWord } from './guessed-word.entity';
import { Category } from 'src/categories/category.entity';

@Entity('is_cw_word')
export class Word {
  @PrimaryGeneratedColumn()
  word_id: number;

  @Column()
  content: string;

  @Column({ default: false })
  is_approved: boolean;

  @OneToMany(() => GuessedWord, (guessedWord) => guessedWord.word_id)
  guessed_words: GuessedWord[];

  @ManyToMany(() => Category, (category) => category.words)
  @JoinTable({
    name: 'is_cw_word_category',
    joinColumn: { name: 'word_id', referencedColumnName: 'word_id' },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  })
  categories: Category[];
}
