import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  async deserializeUser(id: number, done: (a: null, b: User | null) => void) {
    const user = await this.userService.findById(id);
    return user ? done(null, user) : done(null, null);
  }

  serializeUser(user: User, done: (a: null, b: User | null) => void) {
    done(null, user);
  }
}
