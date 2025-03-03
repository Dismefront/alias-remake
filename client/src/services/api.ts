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
  } catch (error) {
    console.error('Error registering');
    throw error;
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const response = apiClient.post('auth/login', {
      username,
      password,
    });
    return (await response).data as { ok: boolean };
  } catch (error) {
    console.error('Error logging in');
    throw error;
  }
};
