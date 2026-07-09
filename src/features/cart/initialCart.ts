import { PRODUCTS } from '../../assets/products/products.ts';
import type { CartProduct } from './cartTypes.ts';

// Mockup: creates cart's content when entering /cart
export const INITIAL_CART: CartProduct[] = PRODUCTS.filter(
  (product) => product.id === 1 || product.id === 2
).map((product) => ({
  ...product,
  dates: [],
}));
