import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(REPOSITORIES.category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepository.find();
  }
}
