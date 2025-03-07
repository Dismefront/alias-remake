import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import { GuessedWord } from './guessed-word.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class WordService {
  constructor(
    @Inject(REPOSITORIES.word) private wordRepository: Repository<Word>,
    @Inject(REPOSITORIES.guessedWord)
    private guessedWordRepository: Repository<GuessedWord>,
  ) {}

  async save(content: string, suggested_by: User) {
    const word = new Word();
    word.content = content;
    word.suggested_by = suggested_by;
    return await this.wordRepository.save(word);
  }

  async update(word: Word) {
    return await this.wordRepository.save(word);
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
}
