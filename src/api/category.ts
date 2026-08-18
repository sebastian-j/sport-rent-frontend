import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type CategoryItem = components['schemas']['app__schemas__category__CategoryResponse'];

export const getCategories = () => api.GET('/categories');

export const getRandomCategory = () => api.GET('/categories/random');
