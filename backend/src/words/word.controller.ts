import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { WordService } from './word.service';
import { Response } from 'express';
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
}
