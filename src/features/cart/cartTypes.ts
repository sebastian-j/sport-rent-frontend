import type { components } from '../../api/generated/schema.ts';
import type { RentalDate } from './rentalDate.ts';

type CartProductResponse = components['schemas']['CartItemResponse'];
type CartProductSizeResponse = CartProductResponse['sizes'][number];

export type CartProduct = Pick<CartProductResponse, 'slug' | 'price' | 'image'> & {
  name: CartProductResponse['product_name'];
  alt: NonNullable<CartProductResponse['alt']>;
  sizes: CartProductSizeResponse['size'][];
  dates: RentalDate[];
};

export type ProductInformation = {
  totalQuantity: number;
  totalDays: number;
  totalCost: number;
};

export type OrderInformation = {
  totalValue: number;
  totalQuantity: number;
};

export type DateField = 'start_date' | 'end_date';

export type InvalidRentalDate = {
  productSlug: string;
  date: RentalDate;
};
