import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REPOSITORIES } from 'src/configs/constants';
import { Message } from './message.entity';
import { Recording } from './recordings.entity';

export const dataProviders: Provider[] = [
  {
    provide: REPOSITORIES.message,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: REPOSITORIES.recording,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Recording),
    inject: ['DATA_SOURCE'],
  },
];
