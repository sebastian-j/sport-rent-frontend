import type { PRODUCTS } from '../../assets/products/products.ts';
import type { RentalDate } from './rentalDate.ts';

type Product = (typeof PRODUCTS)[number];

export type CartProduct = Product & {
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
  productId: number;
  date: RentalDate;
};
