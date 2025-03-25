import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server, Socket } from 'socket.io';
import { LobbyService } from 'src/lobbies/lobby.service';
import { sessionMiddleWare } from 'src/main';

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

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.request.session.user;
    if (!user) {
      console.log('user is absent');
      client.disconnect();
      return;
    }
    const lobbyId = client.handshake.query.lobbyId as string;
    const lobby = this.lobbyService.getLobbyByUUID(lobbyId);
    if (!lobby) {
      console.log('lobby is absent');
      client.disconnect();
      return;
    }
    if (!lobby?.members) {
      lobby.members = [];
    } else {
      lobby.members.push(user);
    }
  }
}
