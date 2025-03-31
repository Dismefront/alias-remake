import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GameGateway } from './game.gateway';
import { ConfigModule } from '@nestjs/config';
import { LobbyModule } from 'src/lobbies/lobby.module';
import { WordModule } from 'src/words/word.module';
import { GameService } from './game.service';
import { gameProviders } from './game.providers';

@Module({
  providers: [...gameProviders, GameGateway, GameService],
  imports: [
    DatabaseModule,
    ConfigModule,
    forwardRef(() => LobbyModule),
    WordModule,
  ],
  exports: [GameService],
})
export class GameModule {}
