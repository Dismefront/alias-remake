import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserCredentials } from 'src/common/interfaces';
import { UserService } from './user.service';
import { AppAuthGuard } from 'src/auth/auth.guard';

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

  @UseGuards(AppAuthGuard)
  @Get('me')
  getOwnUser(@Req() request: Request) {
    return request.session.user;
  }

  @UseGuards(AppAuthGuard)
  @Get('get-one/:username')
  async getUser(@Param('username') username: string) {
    const data = await this.userService.findOnesFullInfo(username);
    if (data === null) return data;
    //@ts-expect-error rem ph
    delete data.password_hash;
    return data;
  }

  @UseGuards(AppAuthGuard)
  @Post('block')
  async blockUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { user_id: number; is_blocked: boolean; cause: string },
  ) {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send('You are not able to block this user');
      return;
    }
    await this.userService.changeBlockStatus(
      body.user_id,
      body.is_blocked,
      req.session.user.user_id!,
      body.cause,
    );
    res.status(200).send();
  }
}
