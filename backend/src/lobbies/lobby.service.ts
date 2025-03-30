import { Inject, Injectable } from '@nestjs/common';
import { Lobby } from './lobby.entity';
import { CreateLobbyReq } from 'src/common/interfaces';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { randomUUID } from 'crypto';
import { LobbyInGame } from './in-game-lobby.entity';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(REPOSITORIES.lobby) private lobbyRepository: Repository<Lobby>,
  ) {}

  private lobbyInstances = new Map<string, LobbyInGame>();

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
    const dbLobby = await this.lobbyRepository.save(newLobby);
    dbLobby.members = [];
    const lobbyInstanceId = `${newLobby.lobby_name}-${dbLobby.lobby_id}`;
    this.lobbyInstances.set(lobbyInstanceId, dbLobby);
    const uuid = randomUUID();
    this.lobbyInstances.set(uuid, dbLobby);
    return uuid;
  }

  getLobbyByUUID(uuid: string) {
    return this.lobbyInstances.get(uuid) || null;
  }
}
