import type { UserStore } from '@/types/data';
import axios from 'axios';

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
    const response = apiClient.post('user/register', {
      username,
      password,
    });
    return (await response).data as { ok: boolean };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    throw new Error('The user with these credentials already exists');
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const response = apiClient.post('auth/login', {
      username,
      password,
    });
    return (await response).data as { ok: boolean };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid login or password');
  }
};

export const getUserInfo = async (): Promise<UserStore> => {
  try {
    const response = apiClient.get('user/me');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ((await response) as any).data;
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
