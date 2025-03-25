import { CategoryType } from 'src/categories/category.entity';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CreateCategoryReq {
  collectionName: string;
  collectionType: CategoryType;
  includeWords: string[];
  includeCategories: string[];
}

export interface SuggestWordReq {
  content: string;
  categoryId: number;
}

export interface CreateLobbyReq {
  lobby_name: string;
  password?: string;
  is_private: boolean;
  round_time: number;
  goal_points: number;
  max_rounds: number;
  categoryIds: number[];
}
