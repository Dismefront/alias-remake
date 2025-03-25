import type { CollectionStore } from '@/types/data';

export interface CreateCategoryReq {
  collectionName: string;
  collectionType: string;
  includeWords: string[];
  includeCategories: string[];
}

export type GetAllCollectionsRes = CollectionStore[];

export interface SuggestOneWordReq {
  categoryId: number;
  content: string;
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
