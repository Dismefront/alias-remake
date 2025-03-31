import { forwardRef, Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './lobby.providers';
import { DatabaseModule } from 'src/database/database.module';
import { GameModule } from 'src/games/game.module';

@Module({
  providers: [LobbyService, ...lobbyProviders],
  controllers: [LobbyController],
  exports: [LobbyService],
  imports: [DatabaseModule, forwardRef(() => GameModule)],
})
export class LobbyModule {}
