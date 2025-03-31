import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomInt } from 'crypto';
import { IncomingMessage } from 'http';
import { Server, Socket } from 'socket.io';
import { LobbyInGame, Team } from 'src/lobbies/in-game-lobby.entity';
import { Lobby } from 'src/lobbies/lobby.entity';
import { LobbyService } from 'src/lobbies/lobby.service';
import { sessionMiddleWare } from 'src/main';
import { UserInGame } from 'src/users/in-game-user.entity';
import { WordInGame } from 'src/words/word-in-game.entity';
import { WordService } from 'src/words/word.service';
import { GameService } from './game.service';

@WebSocketGateway(91, {
  namespace: /\/play\/.*/,
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly wordService: WordService,
    private readonly gameService: GameService,
  ) {}

  afterInit() {
    const wrap =
      (
        middleware: (
          socket: IncomingMessage,
          obj: object,
          next: () => void,
        ) => void,
      ) =>
      (socket: Socket, next: () => void) =>
        middleware(socket.request, {}, next);
    this.server.use(
      wrap(
        sessionMiddleWare as (
          socket: IncomingMessage,
          obj: object,
          next: () => void,
        ) => void,
      ),
    );
  }

  async handleDisconnect(client: Socket) {
    const { lobbyId, lobby } = this.getLobby(client);
    await client.leave(lobbyId);
    const user = client.request.session.user;
    if (lobby) {
      lobby.members = lobby.members.filter(
        (member) => member.user_id !== user?.user_id,
      );
      this.kickMemberFromTeam(lobby, user!);
      if (lobby.members.length === 0) {
        await this.lobbyService.updateLobbyValidity(lobby, false);
      }
      await this.lobbyService.saveGameLobby(lobby, -1);
    }
    this.broadcastPlayersState(lobbyId, lobby!);
    client.disconnect();
  }

  kickMemberFromTeam(lobby: LobbyInGame, user: UserInGame) {
    lobby.teams = lobby.teams
      ?.map((team) => ({
        ...team,
        members: team.members.filter(
          (member) => member.user_id !== user?.user_id,
        ),
      }))
      .filter((team) => team.members.length !== 0 && team.members);
    return lobby.teams;
  }

  async handleConnection(client: Socket) {
    const user = client.request.session.user;
    if (!user) {
      console.log('user is absent');
      client.disconnect();
      return;
    }
    const { lobbyId, lobby } = this.getLobby(client);
    if (!lobby) {
      client.emit(
        'permission-error',
        'The lobby you are trying to connect does not exist',
      );
      client.disconnect();
      return;
    }
    (user as UserInGame).teamAttendanceId = -1;
    if (!lobby?.members) {
      lobby.members = [];
    }
    if (!lobby.teams) {
      lobby.teams = [];
    }
    lobby.members.push(user);
    await client.join(lobbyId);
    this.broadcastPlayersState(lobbyId, lobby);
  }

  getLobby(client: Socket): { lobbyId: string; lobby: LobbyInGame | null } {
    const lobbyId = client.handshake.query.lobbyId as string;
    return { lobbyId, lobby: this.lobbyService.getLobbyByUUID(lobbyId) };
  }

  broadcastPlayersState(lobbyId: string, lobby: Lobby) {
    console.log(lobbyId, lobby);
    this.server.to(lobbyId).emit('lobby-state', lobby);
  }

  newTeamForUser(user: UserInGame, lobbyId: string, lobby: LobbyInGame) {
    const team = new Team();
    team.currentHost = 0;
    team.id = randomInt(1, 999_999_999_999);
    team.members = [user];
    lobby.teams!.push(team);
    user.teamAttendanceId = team.id;
  }

  @SubscribeMessage('switch-team')
  switchTeam(@ConnectedSocket() client: Socket, @MessageBody() id: number) {
    const { lobby, lobbyId } = this.getLobby(client);
    const user = client.request.session.user! as UserInGame;
    if (!lobby || user.teamAttendanceId === id) {
      return;
    }
    lobby.teams = this.kickMemberFromTeam(lobby, user);
    const targetTeam = lobby.teams?.find((team) => team.id === id);
    user.teamAttendanceId = targetTeam!.id;
    targetTeam!.members.push(user);
    this.broadcastPlayersState(lobbyId, lobby);
  }

  @SubscribeMessage('create-team')
  createTeam(@ConnectedSocket() client: Socket) {
    const { lobby, lobbyId } = this.getLobby(client);
    const user = client.request.session.user! as UserInGame;
    if (user.teamAttendanceId === -1) {
      this.newTeamForUser(user, lobbyId, lobby!);
      this.broadcastPlayersState(lobbyId, lobby!);
      return;
    }
    const curTeam = lobby?.teams?.find((t) => t.id === user.teamAttendanceId);
    if (curTeam && curTeam.members.length === 1) {
      return;
    }
    lobby!.teams = this.kickMemberFromTeam(lobby!, user);
    this.newTeamForUser(user, lobbyId, lobby!);
    this.broadcastPlayersState(lobbyId, lobby!);
  }

  @SubscribeMessage('start-game')
  async startGame(@ConnectedSocket() client: Socket) {
    const { lobby, lobbyId } = this.getLobby(client);
    lobby!.is_game_going = true;
    lobby!.hostTeamId = 0;
    lobby!.teams![0].currentHost = 0;
    await this.lobbyService.updateIsGameGoing(lobby!, true);
    await this.gameService.createGame(lobby!, lobbyId);
    this.broadcastPlayersState(lobbyId, lobby!);
  }

  @SubscribeMessage('toggle-word-approval')
  toggleWordApproval(
    @ConnectedSocket() client: Socket,
    @MessageBody() idx: number,
  ) {
    const { lobbyId } = this.getLobby(client);
    const tempLobbyValues = this.lobbyService.getLobbyTemps(lobbyId);
    tempLobbyValues!.words[idx].guessed_approved =
      !tempLobbyValues?.words[idx].guessed_approved;
    this.server.to(lobbyId).emit('round-info', tempLobbyValues);
  }

  @SubscribeMessage('get-word')
  async getWord(@ConnectedSocket() client: Socket) {
    const { lobbyId, lobby } = this.getLobby(client);
    const word = await this.wordService.getRandomFromCategory(
      lobby!.categories[0].category_id,
    );
    word.guessed_approved = true;
    const tempLobbyValues = this.lobbyService.getLobbyTemps(lobbyId);
    tempLobbyValues?.words.push(word);
    this.server.to(lobbyId).emit('round-info', tempLobbyValues);
  }

  updateTeamGuessedWords(lobby: LobbyInGame, temps: { words: WordInGame[] }) {
    if (!temps.words) {
      temps.words = [];
    }
    if (
      lobby.teams![lobby.teams!.length + (lobby.hostTeamId! - 1)].wordsGuessed
    ) {
      lobby.teams![
        lobby.teams!.length + (lobby.hostTeamId! - 1)
      ].wordsGuessed.push(...temps.words.filter((w) => w.guessed_approved));
    } else {
      lobby.teams![lobby.teams!.length + (lobby.hostTeamId! - 1)].wordsGuessed =
        [...temps.words.filter((w) => w.guessed_approved)];
    }
    temps.words = [];
  }

  async finishGameForLobby(
    lobby: LobbyInGame,
    lobbyId: string,
    temps: {
      words: WordInGame[];
      rounds_left: number;
      is_round_going: boolean;
    },
  ) {
    lobby.is_game_going = false;
    this.updateTeamGuessedWords(lobby, temps);
    const winnerTeam = lobby.teams?.reduce(
      (max, item) =>
        item.wordsGuessed.length > max.wordsGuessed.length ? item : max,
      lobby.teams[0],
    );
    lobby.teams![0].currentHost = 0;
    const winnerLobbyId = await this.lobbyService.saveGameLobby(
      lobby,
      winnerTeam!.id,
    );
    temps.rounds_left = lobby.max_rounds;
    this.server.to(lobbyId).emit('declare-winner', winnerTeam);
    this.server.to(lobbyId).emit('lobby-state', lobby);
    lobby.teams?.forEach((t) => {
      t.wordsGuessed = [];
    });
    await this.gameService.updateGameStatus(lobby, lobbyId, winnerLobbyId);
  }

  @SubscribeMessage('start-round')
  async startRound(@ConnectedSocket() client: Socket) {
    const { lobby, lobbyId } = this.getLobby(client);
    const temps = this.lobbyService.getLobbyTemps(lobbyId)!;
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout;
    if (temps.is_round_going) {
      return;
    }
    if (temps.rounds_left === 0 && lobby?.is_game_going) {
      await this.finishGameForLobby(lobby, lobbyId, temps);
      return;
    }
    this.updateTeamGuessedWords(lobby!, temps);
    if (lobby!.hostTeamId === 0) {
      if (
        lobby?.teams?.find((x) => x.wordsGuessed.length >= lobby.goal_points)
      ) {
        await this.finishGameForLobby(lobby, lobbyId, temps);
        return;
      } else {
        temps.rounds_left -= 1;
      }
    }

    temps.is_round_going = true;

    temps.words = [];
    temps.leftSeconds = lobby!.round_time;
    this.server.to(lobbyId).emit('round-info', temps);
    const tick = () => {
      temps.leftSeconds -= 1;
      if (temps.leftSeconds < 0) {
        temps.is_round_going = false;
        this.server.to(lobbyId).emit('round-info', temps);
        temps.leftSeconds = lobby!.round_time;

        if (lobby!.teams!.length) {
          lobby!.teams![lobby!.hostTeamId!].currentHost += 1;
          lobby!.teams![lobby!.hostTeamId!].currentHost %=
            lobby!.teams![lobby!.hostTeamId!].members.length;
          lobby!.hostTeamId! += 1;
          lobby!.hostTeamId! %= lobby!.teams!.length;
        }
        this.broadcastPlayersState(lobbyId, lobby!);
        clearInterval(intervalId);
      } else {
        this.server.to(lobbyId).emit('round-info', temps);
      }
    };
    intervalId = setInterval(tick, 1000);
    this.broadcastPlayersState(lobbyId, lobby!);
  }
}
