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
