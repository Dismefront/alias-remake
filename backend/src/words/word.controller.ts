import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WordService } from './word.service';
import { Request, Response } from 'express';
import { AppAuthGuard } from 'src/auth/auth.guard';

@UseGuards(AppAuthGuard)
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post('change-status')
  async changeWordStatus(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { word_id: number; is_approved: boolean },
  ) {
    if (req.session.user?.role === 'ADMIN') {
      await this.wordService.updateStatus(body.word_id, body.is_approved);
      res.send('ok');
      return;
    }
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).send('You are not an admin');
  }
}
