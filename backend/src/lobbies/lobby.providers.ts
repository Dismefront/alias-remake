import { Provider } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Lobby } from './lobby.entity';
import { DataSource } from 'typeorm';

export const lobbyProviders: Provider[] = [
  {
    provide: REPOSITORIES.lobby,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Lobby),
    inject: ['DATA_SOURCE'],
  },
];
