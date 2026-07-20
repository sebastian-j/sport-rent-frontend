import { request } from './client.ts';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const login = (req: LoginRequest): Promise<LoginResponse | undefined> =>
  request('/auth/login', { method: 'POST', body: req });
