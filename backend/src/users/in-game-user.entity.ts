import { User } from './user.entity';

export class UserInGame extends User {
  teamAttendanceId?: number;
  teamHost?: boolean;
}
