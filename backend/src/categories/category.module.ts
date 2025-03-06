import { Module } from '@nestjs/common';
import { categoryProviders } from './category.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  providers: [...categoryProviders, CategoryService],
  imports: [DatabaseModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
