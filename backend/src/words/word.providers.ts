import { DataSource } from 'typeorm';
import { REPOSITORIES } from 'src/configs/constants';
import { Word } from './word.entity';
import { GuessedWord } from './guessed-word.entity';

export const wordProviders = [
  {
    provide: REPOSITORIES.word,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Word),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: REPOSITORIES.guessedWord,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GuessedWord),
    inject: ['DATA_SOURCE'],
  },
];
