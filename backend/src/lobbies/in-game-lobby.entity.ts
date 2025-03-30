import { UserInGame } from 'src/users/in-game-user.entity';
import { Word } from 'src/words/word.entity';
import { Lobby } from './lobby.entity';

export class LobbyInGame extends Lobby {
  hostTeamId?: number;
  teams?: Team[];
  members: UserInGame[];
}

export class Team {
  id: number;
  members: UserInGame[];
  currentHost: number;
  wordsGuessed: Word[];
}
