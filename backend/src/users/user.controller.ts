import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserCredentials } from 'src/common/interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() credentials: UserCredentials,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    const user = await this.userService.addNew(
      credentials.username,
      credentials.password,
    );
    request.login(user, (error) => {
      if (error) {
        console.log(error);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: 'Error registering',
        });
        return;
      }
      request.session.user = request.user;
      response.send({
        message: 'User registered successfully',
      });
    });
  }
}
