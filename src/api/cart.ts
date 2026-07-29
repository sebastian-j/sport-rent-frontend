import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type PromoCodeValidationRequest = components['schemas']['PromoCodeValidationRequest'];
export type AddToCartRequest = components['schemas']['AddToCartRequest'];
export type UpdateCartItemRequest = components['schemas']['UpdateCartItemRequest'];

export const getCart = () => api.GET('/cart');

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

export const deleteCartProduct = (productId: number) =>
  api.DELETE('/cart/products/{product_id}', {
    params: { path: { product_id: productId } },
  });

export const validatePromoCode = async (body: PromoCodeValidationRequest) =>
  api.POST('/cart/promo-code/validate', { body });
