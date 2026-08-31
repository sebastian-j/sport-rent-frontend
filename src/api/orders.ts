import { api } from './client.ts';
import type { components, paths } from './generated/schema.ts';

export type CreateOrderRequest = components['schemas']['CreateOrderRequest'];
export type OrderResponse = components['schemas']['OrderResponse'];
export type OrdersQuery = NonNullable<paths['/orders']['get']['parameters']['query']>;

export const createOrder = (body: CreateOrderRequest) => api.POST('/orders', { body });

export const getOrders = (query: OrdersQuery = {}) =>
  api.GET('/orders', {
    params: { query },
  });

export const getOrder = (orderId: number) =>
  api.GET('/orders/{order_id}', {
    params: { path: { order_id: orderId } },
  });
