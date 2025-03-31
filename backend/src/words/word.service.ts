import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Word } from './word.entity';
import { GuessedWord } from './guessed-word.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { WordInGame } from './word-in-game.entity';

@Injectable()
export class WordService {
  constructor(
    @Inject(REPOSITORIES.word) private wordRepository: Repository<Word>,
    @Inject(REPOSITORIES.guessedWord)
    private guessedWordRepository: Repository<GuessedWord>,
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  async save(content: string, suggested_by: User) {
    const word = new Word();
    word.content = content;
    word.suggested_by = suggested_by;
    return await this.wordRepository.save(word);
  }

  async updateStatus(word_id: number, is_approved: boolean) {
    return await this.wordRepository.update(
      { word_id },
      {
        is_approved,
      },
    );
  }

  async update(word: Word) {
    return await this.wordRepository.save(word);
  }

  async updateMany(words: Word[]) {
    return await this.wordRepository.save(words);
  }

  async findOne(content: string) {
    return await this.wordRepository.findOne({
      where: {
        content,
      },
    });
  }

  async findOneWithCategories(content: string) {
    return await this.wordRepository.findOne({
      where: {
        content,
      },
      relations: ['categories'],
    });
  }

  async findAllFromCategory(category: Category) {
    return await this.wordRepository.find({
      where: {
        categories: {
          category_id: category.category_id,
        },
      },
      relations: ['categories'],
    });
  }

  async findAllUnapproved() {
    return await this.wordRepository.find({
      where: {
        is_approved: IsNull(),
      },
    });
  }

  async getRandomFromCategory(category_id: number) {
    return (
      await this.dataSource.query<WordInGame[]>(
        'SELECT * FROM get_random_word_by_category($1)',
        [category_id],
      )
    )[0];
  }

  async getGameResultsByUserId(user_id: number) {
    return await this.dataSource.query<
      {
        lobby_name: string;
        start_time: Date;
        end_time: Date;
        lobby_id: number;
      }[]
    >('SELECT * FROM get_user_game_results($1)', [user_id]);
  }
}
