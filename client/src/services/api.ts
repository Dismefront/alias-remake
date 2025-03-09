import type { UserStore, WordStore } from '@/types/data';
import axios from 'axios';
import type { CreateCategoryReq, GetAllCollectionsRes } from './interfaces';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const postRegister = async (username: string, password: string) => {
  try {
    const response = await apiClient.post<{ message: string }>(
      'user/register',
      {
        username,
        password,
      },
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    throw new Error('The user with these credentials already exists');
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.post<{ message: string }>('auth/login', {
      username,
      password,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid login or password');
  }
};

export const getUserInfo = async (): Promise<UserStore> => {
  try {
    const response = await apiClient.get<UserStore>('user/me');
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('You are not logged in');
  }
};

export const postLogout = async () => {
  try {
    await apiClient.post('auth/logout');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('could not log out');
  }
};

export const postCreateCollection = async (data: CreateCategoryReq) => {
  try {
    const response = await apiClient.post<{ message: string }>(
      'categories/create',
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Could not create collection',
    );
  }
};

export const getAllCollections = async () => {
  try {
    const response = await apiClient.get<GetAllCollectionsRes>(
      'categories/get-user-available',
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Could not fetch collections',
    );
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await apiClient.get<UserStore>(`user/get-one/${username}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Could not fetch user');
  }
};

export const postUpdateWordStatus = async (
  word_id: number,
  is_approved: boolean,
) => {
  try {
    const response = await apiClient.post<WordStore>(`word/change-status`, {
      word_id,
      is_approved,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Could not update the word status',
    );
  }
};

export const postChangeUserBlockStatus = async (
  user_id: number,
  is_blocked: boolean,
  cause: string,
) => {
  try {
    const response = await apiClient.post<{ ok: boolean }>(`user/block`, {
      user_id,
      is_blocked,
      cause,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Could not update the word status',
    );
  }
};
