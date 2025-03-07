import { Module } from '@nestjs/common';
import { wordProviders } from './word.providers';
import { WordService } from './word.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [...wordProviders, WordService],
  exports: [WordService],
  imports: [DatabaseModule],
})
export class WordModule {}
