import { Provider } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { DataSource } from 'typeorm';
import { Game } from './game.entity';
import { GameStats } from './game-stats.entity';

export const gameProviders: Provider[] = [
  {
    provide: REPOSITORIES.game,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Game),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: REPOSITORIES.gameStats,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(GameStats),
    inject: ['DATA_SOURCE'],
  },
];
