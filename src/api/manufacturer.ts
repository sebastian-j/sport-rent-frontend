import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type ManufacturerItem = components['schemas']['ManufacturerResponse'];

export const getManufacturers = () => api.GET('/manufacturers');
