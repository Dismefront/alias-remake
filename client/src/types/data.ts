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
