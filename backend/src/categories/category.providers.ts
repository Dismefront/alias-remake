import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';
import { REPOSITORIES } from 'src/configs/constants';

export const categoryProviders: Provider[] = [
  {
    provide: REPOSITORIES.category,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: ['DATA_SOURCE'],
  },
];
