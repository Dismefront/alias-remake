import { Word } from './word.entity';

export class WordInGame extends Word {
  guessed_approved?: boolean;
}
