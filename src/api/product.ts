import { api } from './client.ts';
import type { operations } from './generated/schema.ts';

type QueryParams = operations['get_products_product_get']['parameters']['query'];
export type ProductQueryParams = NonNullable<QueryParams> & {
  category?: string[] | null;
};

export const getProducts = (params?: ProductQueryParams) => {
  return api.GET('/product', {
    params: {
      query: params,
    },
  });
};

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

export const getCategoriesCount = (params?: ProductQueryParams) => {
  return api.GET('/product/count', {
    params: {
      query: params,
    },
  });
};
