import { api } from './client.ts';
import type { components } from './generated/schema.ts';

type PromoCodeValidationRequest = components['schemas']['PromoCodeValidationRequest'];

export const validatePromoCode = async (body: PromoCodeValidationRequest) =>
  api.POST('/cart/promo-code/validate', { body });
