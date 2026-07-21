import type { components } from './generated/schema.ts';
import { request } from './client.ts';

type LoginRequest = components['schemas']['LoginRequest'];
type LoginResponse = components['schemas']['LoginResponse'];

export const login = (body: LoginRequest): Promise<LoginResponse | undefined> =>
  request('auth/login', { method: 'POST', body });
