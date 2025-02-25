import { Module } from '@nestjs/common';
import { categoryProviders } from './category.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryService } from './category.service';

@Module({
  providers: [...categoryProviders, CategoryService],
  imports: [DatabaseModule],
})
export class CategoryModule {}
