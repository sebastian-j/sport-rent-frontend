import type { paths } from './generated/schema.ts';
import { request } from './client.ts';

type LoginOperation = paths['/auth/login']['post'];
type LoginRequest = LoginOperation['requestBody']['content']['application/json'];
type LoginResponse = LoginOperation['responses'][200]['content']['application/json'];

export const login = (body: LoginRequest): Promise<LoginResponse | undefined> =>
  request<LoginResponse>('/auth/login', { method: 'POST', body });
