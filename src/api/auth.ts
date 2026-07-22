import type { components } from './generated/schema.ts';
import { api } from './client.ts';

type LoginRequest = components['schemas']['LoginRequest'];

export const login = (body: LoginRequest) => api.POST('/auth/login', { body });
