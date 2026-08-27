import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type CreateOrderRequest = components['schemas']['CreateOrderRequest'];
export type OrderResponse = components['schemas']['OrderResponse'];

export const createOrder = (body: CreateOrderRequest) => api.POST('/orders', { body });

export const getOrders = () => api.GET('/orders');

export const getOrder = (orderId: number) =>
  api.GET('/orders/{order_id}', {
    params: { path: { order_id: orderId } },
  });
