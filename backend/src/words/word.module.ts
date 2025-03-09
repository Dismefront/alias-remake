import { Module } from '@nestjs/common';
import { wordProviders } from './word.providers';
import { WordService } from './word.service';
import { DatabaseModule } from 'src/database/database.module';
import { WordController } from './word.controller';

@Module({
  providers: [...wordProviders, WordService],
  exports: [WordService],
  imports: [DatabaseModule],
  controllers: [WordController],
})
export class WordModule {}
