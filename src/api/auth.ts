import { getCsrfHeaders } from './authSession.ts';
import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type LoginRequest = components['schemas']['LoginRequest'];
type ResetPasswordRequest = components['schemas']['ResetPasswordRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

export const login = (body: LoginRequest) => api.POST('/auth/login', { body });
export const logout = () => api.POST('/auth/logout', { headers: getCsrfHeaders() });
export const resetPassword = (body: ResetPasswordRequest) =>
  api.POST('/auth/reset-password', { body });
export const register = (body: RegisterRequest) => api.POST('/auth/register', { body });
