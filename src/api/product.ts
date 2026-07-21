import { request } from './client.ts';
import { type ProductProps } from '../features/product/productProps.ts';
type ProductResponse = ProductProps;

export const getProducts = (): Promise<ProductResponse[] | undefined> => {
  return request<ProductResponse[]>('/product');
};

export const getProductBySlug = (slug: string): Promise<ProductResponse | undefined> => {
  return request<ProductResponse>('/product/' + slug);
};

export const getProductAvailability = (
  slug: string,
  startDate: string,
  endDate: string
): Promise<ProductResponse | undefined> => {
  return request<ProductResponse>(
    '/product/' + slug + '/availability?start_date=' + startDate + '&end_date=' + endDate
  );
};
