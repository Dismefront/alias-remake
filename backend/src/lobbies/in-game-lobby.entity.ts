import { UserInGame } from 'src/users/in-game-user.entity';
import { Lobby } from './lobby.entity';
import { WordInGame } from 'src/words/word-in-game.entity';

export class LobbyInGame extends Lobby {
  hostTeamId?: number;
  teams?: Team[];
  members: UserInGame[];
}

export class Team {
  id: number;
  members: UserInGame[];
  currentHost: number;
  wordsGuessed: WordInGame[];
}
