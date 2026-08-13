import type { components } from './generated/schema.ts';
import { api } from './client.ts';

export type CategoryItem = components['schemas']['app__schemas__category__CategoryResponse'];

export const getCategories = () => api.GET('/categories');

export const getRandomCategory = () => api.GET('/categories/random');
