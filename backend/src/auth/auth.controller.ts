import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Res() res: Response, @Req() req: Request) {
    req.session.user = req.user;
    res.send({ message: 'Logged in successfully' });
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.send({ message: 'Logged out' });
    });
  }
}
