import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { CreateLobbyReq } from 'src/common/interfaces';
import { AppAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('lobbies')
@UseGuards(AppAuthGuard)
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('create')
  async create(@Body() createLobbyDto: CreateLobbyReq, @Req() req: Request) {
    return {
      lobby_uuid: await this.lobbyService.createMasterOne(
        createLobbyDto,
        req.session.user!.user_id!,
      ),
    };
  }
}
