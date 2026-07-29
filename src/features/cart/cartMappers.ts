import type { components } from '../../api/generated/schema.ts';
import { parseLocalDate } from '../../utils/localDate.ts';
import type { CartProduct } from './cartTypes.ts';
import type { RentalDate } from './rentalDate.ts';

type CartItemDateResponse = components['schemas']['CartItemDate'];
type CartItemResponse = components['schemas']['CartItemResponse'];

export function mapCartDate(item: CartItemDateResponse): RentalDate {
  return {
    ...item,
    uiKey: `item-${item.id}`,
    size: item.size ?? null,
    start_date: parseLocalDate(item.start_date),
    end_date: parseLocalDate(item.end_date),
  };
}

export function mapCartProduct(product: CartItemResponse): CartProduct {
  return {
    id: product.product_id,
    name: product.product_name,
    description: '',
    price: product.price,
    slug: '',
    images: product.image ? [product.image] : [],
    alt: product.alt ?? product.product_name,
    category: '',
    sizes: product.sizes,
    dates: product.dates.map(mapCartDate),
  };
}
