import { api } from './client.ts';
import type { components, paths } from './generated/schema.ts';

export const getLoyalty = () => api.GET('/loyalty');
export type LoyaltyHistoryQuery = NonNullable<
  paths['/loyalty/history']['get']['parameters']['query']
>;
export const getLoyaltyHistory = (query: LoyaltyHistoryQuery = {}) =>
  api.GET('/loyalty/history', {
    params: { query },
  });
export type LoyaltyHistoryItem = components['schemas']['LoyaltyHistoryItemResponse'];
