import type { ProductProps } from '../product/productProps.ts';
import type { RentalDate } from './rentalDate.ts';

type Product = ProductProps;

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
