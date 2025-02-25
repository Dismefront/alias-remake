import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { REPOSITORIES } from 'src/configs/constants';
import { UserBlock } from './user-block.entity';

export const userProviders = [
  {
    provide: REPOSITORIES.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: REPOSITORIES.userBlock,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserBlock),
    inject: ['DATA_SOURCE'],
  },
];
