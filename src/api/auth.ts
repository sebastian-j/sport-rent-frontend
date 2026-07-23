import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type LoginRequest = components['schemas']['LoginRequest'];
type ResetPasswordRequest = components['schemas']['ResetPasswordRequest'];

export const login = (body: LoginRequest) => api.POST('/auth/login', { body });
export const resetPassword = (body: ResetPasswordRequest) =>
  api.POST('/auth/reset-password', { body });
