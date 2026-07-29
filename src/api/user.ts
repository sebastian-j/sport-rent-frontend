import { api } from './client.ts';

export const getUser = () => api.GET('/user');
