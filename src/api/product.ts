import { api } from './client.ts';
import type { operations } from './generated/schema.ts';
import type { paths } from './generated/schema.ts';

type OpenApiGetProductsQuery = NonNullable<paths['/product']['get']['parameters']['query']>;
type GetProductsQuery = OpenApiGetProductsQuery & {
  q?: string | null;
  filter?: {
    sort?: 'name' | 'price' | null;
    order?: 'asc' | 'desc' | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    category?: string[];
  };
};
type ProductCountQuery =
  operations['get_categories_count_product_count_get']['parameters']['query'];

const serializeProductsQuery = (query: GetProductsQuery) => {
  const searchParams = new URLSearchParams();

  if (query.q) {
    searchParams.set('q', query.q);
  }

  if (query.page !== undefined && query.page !== null) {
    searchParams.set('page', String(query.page));
  }

  if (query.pageSize !== undefined && query.pageSize !== null) {
    searchParams.set('pageSize', String(query.pageSize));
  }

  if (query.filter) {
    const { sort, order, minPrice, maxPrice, category } = query.filter;

    if (sort) searchParams.set('sort', sort);
    if (order) searchParams.set('order', order);
    if (minPrice !== null) searchParams.set('minPrice', String(minPrice));
    if (maxPrice !== null) searchParams.set('maxPrice', String(maxPrice));
    category?.forEach((categoryName) => {
      searchParams.append('category', categoryName);
    });
  }

  return searchParams.toString();
};

export const getProducts = (query: GetProductsQuery = {}) =>
  api.GET('/product', {
    params: { query },
    querySerializer: serializeProductsQuery,
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
