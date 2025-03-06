export interface UserCredentials {
  username: string;
  password: string;
}

export interface CreateCategoryReq {
  collectionName: string;
  collectionType: string;
  includeWords: string[];
  includeCategories: string[];
}
