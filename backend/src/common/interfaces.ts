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
