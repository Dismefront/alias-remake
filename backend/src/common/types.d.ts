import { Session } from 'express-session';
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

declare module 'http' {
  interface IncomingMessage {
    session: Session & {
      user?: User;
    };
  }
}
