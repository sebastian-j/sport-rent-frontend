import { api } from './client.ts';

export const getRandomCategory = () => api.GET('/categories/random');
