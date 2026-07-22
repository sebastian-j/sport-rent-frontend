import { api } from './client.ts';

export const getProducts = () => api.GET('/product');

export const getProductBySlug = (slug: string) =>
  api.GET('/product/{slug}', {
    params: {
      path: { slug },
    },
  });

export const getProductAvailability = (slug: string, startDate: string, endDate: string) =>
  api.GET('/product/{slug}/availability', {
    params: {
      path: { slug },
      query: { startDate, endDate },
    },
  });
