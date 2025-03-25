import { Module } from '@nestjs/common';
import { dataProviders } from 'src/data/data.providers';
import { DatabaseModule } from 'src/database/database.module';
import { GameGateway } from './game.gateway';
import { ConfigModule } from '@nestjs/config';
import { LobbyModule } from 'src/lobbies/lobby.module';

@Module({
  providers: [...dataProviders, GameGateway],
  imports: [DatabaseModule, ConfigModule, LobbyModule],
})
export class GameModule {}
