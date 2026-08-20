import { useState } from 'react';

import { validatePromoCode } from '../../api/cart.ts';
import type { components } from '../../api/generated/schema.ts';

type DiscountType = components['schemas']['DiscountType'];

export type PromoDiscount = {
  type: DiscountType;
  value: number;
};

const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

export default function usePromo(orderValue: number) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>();
  const [promoDiscount, setPromoDiscount] = useState<PromoDiscount>();
  const [promoCodeError, setPromoCodeError] = useState<string>();
  const [isPromoCodeValidating, setIsPromoCodeValidating] = useState(false);

  const clearAppliedPromoCode = () => {
    setAppliedPromoCode(undefined);
    setPromoDiscount(undefined);
  };

  const applyPromoCode = async () => {
    if (isPromoCodeValidating) return;

    const normalizedPromoCode = promoCode.trim().toUpperCase();

    if (!normalizedPromoCode) {
      clearAppliedPromoCode();
      setPromoCodeError('Wpisz kod promocyjny.');
      return;
    }

    setIsPromoCodeValidating(true);
    setPromoCodeError(undefined);

    try {
      const { data, error } = await validatePromoCode({ promo_code: normalizedPromoCode });

      if (error || !data) {
        clearAppliedPromoCode();
        setPromoCodeError('Nie udało się sprawdzić kodu promocyjnego.');
        return;
      }

      if (!data.valid || !data.discount_type || data.discount_value == null) {
        clearAppliedPromoCode();
        setPromoCodeError('Nieprawidłowy kod promocyjny.');
        return;
      }

      const discountValue = Number(data.discount_value);
      const minimumOrderValue =
        data.minimum_order_value == null ? undefined : Number(data.minimum_order_value);

      if (
        !Number.isFinite(discountValue) ||
        discountValue <= 0 ||
        (minimumOrderValue !== undefined && !Number.isFinite(minimumOrderValue))
      ) {
        clearAppliedPromoCode();
        setPromoCodeError('Nie udało się odczytać wartości kodu promocyjnego.');
        return;
      }

      if (minimumOrderValue !== undefined && orderValue < minimumOrderValue) {
        clearAppliedPromoCode();
        setPromoCodeError(
          `Kod obowiązuje dla zamówień od ${currencyFormatter.format(minimumOrderValue)}.`
        );
        return;
      }

      setPromoCode(normalizedPromoCode);
      setAppliedPromoCode(normalizedPromoCode);
      setPromoDiscount({
        type: data.discount_type,
        value: discountValue,
      });
      setPromoCodeError(undefined);
    } catch (error) {
      console.error('Błąd podczas sprawdzania kodu promocyjnego:', error);
      clearAppliedPromoCode();
      setPromoCodeError('Nie udało się sprawdzić kodu promocyjnego. Spróbuj ponownie.');
    } finally {
      setIsPromoCodeValidating(false);
    }
  };

  const changePromoCode = (value: string) => {
    setPromoCode(value);
    setPromoCodeError(undefined);
  };

  const removePromoCode = () => {
    setPromoCode('');
    clearAppliedPromoCode();
    setPromoCodeError(undefined);
  };

  return {
    promoCode,
    appliedPromoCode,
    promoDiscount,
    promoCodeError,
    isPromoCodeValidating,
    applyPromoCode,
    changePromoCode,
    removePromoCode,
  };
}
