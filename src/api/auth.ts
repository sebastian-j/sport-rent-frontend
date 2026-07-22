import { request } from './client.ts';
import type { paths } from './generated/schema.ts';

type LoginOperation = paths['/auth/login']['post'];
type LoginRequest = LoginOperation['requestBody']['content']['application/json'];
type LoginResponse = LoginOperation['responses'][200]['content']['application/json'];

export const login = (body: LoginRequest): Promise<LoginResponse | undefined> =>
  request<LoginResponse>('/auth/login', { method: 'POST', body });
