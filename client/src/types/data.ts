export interface WordStore {
  word_id: number;
  content: string;
  is_approved: boolean | null;
}

export interface UserStore {
  created_at: Date;
  is_blocked: boolean;
  role: string;
  user_id: number;
  username: string;
  teamAttendanceId?: number;
  teamHost?: boolean;
  suggested_words?: WordStore[];
  created_categories?: CollectionStore[];
}

export enum CategoryType {
  PUBLIC_PUBLIC = 'public_public',
  LOCAL_LOCAL = 'local_local',
  LOCAL_PUBLIC = 'local_public',
}

export interface CollectionStore {
  category_id: number;
  category_name: string;
  category_type: CategoryType;
  words: any[];
  lobbies: any[];
  created_by: UserStore | null;
  is_approved: boolean | null;
}

export interface Word {
  word_id: number;
  content: string;
  is_approved: boolean;
  suggested_by?: UserStore;
  categories?: CollectionStore[];
  guessed_approved: boolean;
}

export interface Team {
  id: number;
  members: UserStore[];
  currentHost: number;
  wordsGuessed: Word[];
}

export interface Lobby {
  lobby_id: number;
  lobby_name: string;
  password: string;
  is_private: boolean;
  is_valid: boolean;
  is_game_going: boolean;
  is_master: boolean;
  created_by?: UserStore;
  round_time: number;
  goal_points: number;
  max_rounds: number;
  master_id: Lobby;
  categories?: CollectionStore[];
  members: UserStore[];
  created_at: Date;
  teams?: Team[];
  hostTeamId?: number;
}

export interface RoundInfo {
  is_round_going: boolean;
  leftSeconds: number;
  words: Word[];
  rounds_left: number;
}
