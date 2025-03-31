import { Inject, Injectable } from '@nestjs/common';
import { Lobby } from './lobby.entity';
import { CreateLobbyReq } from 'src/common/interfaces';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { randomUUID } from 'crypto';
import { LobbyInGame } from './in-game-lobby.entity';
import { WordInGame } from 'src/words/word-in-game.entity';
import { UserInGame } from 'src/users/in-game-user.entity';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(REPOSITORIES.lobby) private lobbyRepository: Repository<Lobby>,
  ) {}

  private lobbyInstances = new Map<string, LobbyInGame>();
  private tempLobbyValues = new Map<
    string,
    {
      is_round_going: boolean;
      rounds_left: number;
      leftSeconds: number;
      words: WordInGame[];
    }
  >();

  async createMasterOne(
    createLobbyReq: CreateLobbyReq,
    created_by: number,
  ): Promise<string> {
    const newLobby = new Lobby();
    newLobby.lobby_name = createLobbyReq.lobby_name;
    newLobby.created_by = { user_id: created_by } as User;
    newLobby.categories = createLobbyReq.categoryIds.map(
      (catId) => ({ category_id: catId }) as Category,
    );
    newLobby.is_master = true;
    newLobby.goal_points = createLobbyReq.goal_points;
    newLobby.max_rounds = createLobbyReq.max_rounds;
    newLobby.is_game_going = false;
    newLobby.is_private = createLobbyReq.is_private;
    newLobby.is_valid = true;
    newLobby.round_time = createLobbyReq.round_time;
    if (createLobbyReq.password) {
      newLobby.password = createLobbyReq.password;
    }
    const dbLobby = await this.lobbyRepository.save(newLobby);
    dbLobby.members = [];
    const lobbyInstanceId = `${newLobby.lobby_name}-${dbLobby.lobby_id}`;
    this.lobbyInstances.set(lobbyInstanceId, dbLobby);
    const uuid = randomUUID();
    this.lobbyInstances.set(uuid, dbLobby);
    this.tempLobbyValues.set(uuid, {
      is_round_going: false,
      leftSeconds: createLobbyReq.round_time,
      words: [],
      rounds_left: createLobbyReq.max_rounds,
    });
    return uuid;
  }

  async updateIsGameGoing(lobby: LobbyInGame, isGameGoing: boolean) {
    lobby.is_game_going = isGameGoing;
    await this.lobbyRepository.update(
      { lobby_id: lobby.lobby_id },
      { is_game_going: isGameGoing },
    );
  }

  async updateLobbyValidity(lobby: LobbyInGame, valid: boolean) {
    await this.lobbyRepository.update(
      { lobby_id: lobby.lobby_id },
      { is_valid: valid },
    );
  }

  async saveGameLobby(lobby: LobbyInGame, winnerLobbyIdLocal: number) {
    let winnerLobbyId = -1;
    await this.lobbyRepository.update(
      { lobby_id: lobby.lobby_id },
      { is_game_going: false },
    );
    if (lobby.teams) {
      for (const team of lobby.teams) {
        const slaveLobby = new Lobby();
        slaveLobby.lobby_name = lobby.lobby_name;
        slaveLobby.created_by = lobby.created_by;
        slaveLobby.categories = lobby.categories;
        slaveLobby.is_valid = lobby.is_valid;
        slaveLobby.is_master = false;
        slaveLobby.goal_points = lobby.goal_points;
        slaveLobby.max_rounds = lobby.max_rounds;
        slaveLobby.is_game_going = false;
        slaveLobby.is_private = lobby.is_private;
        slaveLobby.round_time = lobby.round_time;
        slaveLobby.members = team.members.map(
          (member) => ({ user_id: member.user_id }) as UserInGame,
        );
        slaveLobby.password = lobby.password;
        console.log('nigga', slaveLobby);
        const savedLobbyId = (await this.lobbyRepository.save(slaveLobby))
          .lobby_id;
        if (winnerLobbyIdLocal === team.id) {
          winnerLobbyId = savedLobbyId;
        }
      }
    }
    return winnerLobbyId;
  }

  getLobbyByUUID(uuid: string) {
    return this.lobbyInstances.get(uuid) || null;
  }

  getLobbyTemps(uuid: string) {
    return this.tempLobbyValues.get(uuid) || null;
  }
}
