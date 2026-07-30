import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type OrderDetailResponse = components['schemas']['OrderDetailResponse'];

export const getUser = () => api.GET('/user');

export const getUserHistory = () => api.GET('/user/history');

export const getOrderDetails = (orderId: number) =>
  api.GET('/user/history/{order_id}', {
    params: { path: { order_id: orderId } },
  });
