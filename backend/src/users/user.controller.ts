import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserCredentials } from 'src/common/interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() credentials: UserCredentials,
    @Res() response: Response,
  ): Promise<any> {
    await this.userService.addNew(credentials.username, credentials.password);
    response.status(HttpStatus.OK);
    response.send();
  }
}
