import { api } from './client.ts';

export const getProducts = () => api.GET('/product');

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
