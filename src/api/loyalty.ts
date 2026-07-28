import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export const getLoyalty = () => api.GET('/loyalty');
export const getLoyaltyHistory = () => api.GET('/loyalty/history');
export type LoyaltyHistoryItem = components['schemas']['LoyaltyHistoryItemResponse'];
