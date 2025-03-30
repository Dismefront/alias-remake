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

  constructor(private readonly lobbyService: LobbyService) {}

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
}
