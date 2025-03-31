import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WordService } from './word.service';
import { Request, Response } from 'express';
import { AppAuthGuard } from 'src/auth/auth.guard';
import { AdminOnly } from 'src/auth/admin-only.guard';

@UseGuards(AppAuthGuard)
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post('change-status')
  @UseGuards(AdminOnly)
  async changeWordStatus(
    @Res() res: Response,
    @Body() body: { word_id: number; is_approved: boolean },
  ) {
    await this.wordService.updateStatus(body.word_id, body.is_approved);
    res.send('ok');
  }

  @Get('last-results')
  async getLastResults(@Res() res: Response, @Req() req: Request) {
    const userId = req.session.user!.user_id!;
    const results = await this.wordService.getGameResultsByUserId(userId);
    res.json(results);
  }
}
