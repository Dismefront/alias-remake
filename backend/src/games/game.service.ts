import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { GameStats } from './game-stats.entity';
import { Lobby } from 'src/lobbies/lobby.entity';
import { LobbyInGame } from 'src/lobbies/in-game-lobby.entity';
import { GuessedWord } from 'src/words/guessed-word.entity';

@Injectable()
export class GameService {
  constructor(
    @Inject(REPOSITORIES.game)
    private gameRepository: Repository<Game>,

    @Inject(REPOSITORIES.gameStats)
    private gameStatsRepository: Repository<GameStats>,
  ) {}

  private gameCache: Map<string, Game> = new Map();

  async createGame(lobby: Lobby, lobbyId: string) {
    const newGame = new Game();
    newGame.lobby = lobby;
    const dbGame = await this.gameRepository.save(newGame);
    this.gameCache.set(lobbyId, dbGame);
    return dbGame;
  }

  async updateGameStatus(
    lobby: LobbyInGame,
    lobbyId: string,
    winnerTeamDBid: number,
  ) {
    const game = this.gameCache.get(lobbyId);
    let gameId: number | null = null;
    if (game) {
      game.end_time = new Date();
      game.winner_lobby = { lobby_id: winnerTeamDBid } as Lobby;
      gameId = (await this.gameRepository.save(game)).game_id;
      this.gameCache.delete(lobbyId);
    }
    const gameStats = new GameStats();
    if (gameId) {
      gameStats.game = { game_id: gameId } as Game;
      const guessedWords = lobby.teams?.map((x) => x.wordsGuessed).flat();
      if (guessedWords) {
        gameStats.guessed_word_count = guessedWords.length;
        gameStats.guessed_words = guessedWords.map(
          (word) =>
            ({
              guessed_word_id: word.word_id,
              guessed_by: word.suggested_by,
            }) as GuessedWord,
        );
      }
      await this.gameStatsRepository.save(gameStats);
    }
  }
}
