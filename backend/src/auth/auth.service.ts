import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      return user;
    }
    return null;
  }
}
