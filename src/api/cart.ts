import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type PromoCodeValidationRequest = components['schemas']['PromoCodeValidationRequest'];
export type AddToCartRequest = components['schemas']['AddToCartRequest'];
export type UpdateCartItemRequest = components['schemas']['UpdateCartItemRequest'];

export const getCart = () => api.GET('/cart');

export const getCartStatus = () => api.GET('/cart/status');

export const addCartItem = (body: AddToCartRequest) => api.POST('/cart/items', { body });

export const updateCartItem = (itemId: number, body: UpdateCartItemRequest) =>
  api.PATCH('/cart/items/{item_id}', {
    params: { path: { item_id: itemId } },
    body,
  });

export const deleteCartItem = (itemId: number) =>
  api.DELETE('/cart/items/{item_id}', {
    params: { path: { item_id: itemId } },
  });

export const deleteCartProduct = (productSlug: string) =>
  api.DELETE('/cart/products/{product_slug}', {
    params: { path: { product_slug: productSlug } },
  });

export const validatePromoCode = async (body: PromoCodeValidationRequest) =>
  api.POST('/cart/promo-code/validate', { body });
