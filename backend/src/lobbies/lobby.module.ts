import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './lobby.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [LobbyService, ...lobbyProviders],
  controllers: [LobbyController],
  exports: [LobbyService],
  imports: [DatabaseModule],
})
export class LobbyModule {}
