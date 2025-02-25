import { User } from 'src/users/user.entity';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

declare module 'express' {
  interface Request {
    user: User;
  }
}
