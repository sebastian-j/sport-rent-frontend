import { api } from './client.ts';

export const getProducts = (page?: number, pageSize?: number, signal?: AbortSignal) =>
  api.GET('/product', {
    params: {
      query: {
        ...(page !== undefined ? { page } : {}),
        ...(pageSize !== undefined ? { pageSize } : {}),
      },
    },
    signal,
  });

export const getProductBySlug = (slug: string) =>
  api.GET('/product/{product_slug}', {
    params: {
      path: { product_slug: slug },
    },
  });

export const getProductAvailability = (slug: string, startDate: string, endDate: string) =>
  api.GET('/product/{product_slug}/availability', {
    params: {
      path: { product_slug: slug },
      query: { start_date: startDate, end_date: endDate },
    },
  });
