import { api } from './client.ts';
import type { operations, paths } from './generated/schema.ts';

export type GetProductsQuery = NonNullable<paths['/product']['get']['parameters']['query']>;
type ProductCountQuery =
  operations['get_categories_count_product_count_get']['parameters']['query'];

export const getProducts = (query: GetProductsQuery = {}) =>
  api.GET('/product', {
    params: { query },
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

export const getCategoriesCount = (params?: ProductCountQuery) => {
  return api.GET('/product/count', {
    params: {
      query: params,
    },
  });
};
