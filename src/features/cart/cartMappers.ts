import type { components } from '../../api/generated/schema.ts';
import { parseLocalDate } from '../../utils/localDate.ts';
import { resolveImageUrl } from '../../utils/resolveImageUrl.ts';
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
    slug: product.slug,
    name: product.product_name,
    price: product.price,
    image: resolveImageUrl(product.image),
    alt: product.alt ?? product.product_name,
    sizes: product.sizes.map(({ size }) => size),
    dates: product.dates.map(mapCartDate),
  };
}
