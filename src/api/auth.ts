import { getCsrfHeaders } from './authSession.ts';
import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type LoginRequest = components['schemas']['LoginRequest'];
type ResetPasswordRequest = components['schemas']['ResetPasswordRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];
type ValidatePasswordResetRequest = components['schemas']['ValidatePasswordResetRequest'];
type ConfirmPasswordResetRequest = components['schemas']['ConfirmPasswordResetRequest'];
type ChangePasswordRequest = components['schemas']['ChangePasswordRequest'];

export const login = (body: LoginRequest) => api.POST('/auth/login', { body });
export const logout = () => api.POST('/auth/logout', { headers: getCsrfHeaders() });
export const resetPassword = (body: ResetPasswordRequest) =>
  api.POST('/auth/reset-password', { body });
export const validatePasswordReset = (body: ValidatePasswordResetRequest) =>
  api.POST('/auth/reset-password/validate', { body });
export const confirmPasswordReset = (body: ConfirmPasswordResetRequest) =>
  api.POST('/auth/reset-password/confirm', { body });
export const register = (body: RegisterRequest) => api.POST('/auth/register', { body });
export const changePassword = (body: ChangePasswordRequest) =>
  api.POST('/auth/change-password', { body });
