import { Module } from '@nestjs/common';
import { categoryProviders } from './category.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { WordModule } from 'src/words/word.module';
import { CategoryWordApprover } from './category.approver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [...categoryProviders, CategoryService, CategoryWordApprover],
  imports: [DatabaseModule, WordModule, HttpModule, ConfigModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
