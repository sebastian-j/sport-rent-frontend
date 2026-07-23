import { useState } from 'react';

import { validatePromoCode } from '../../api/cart.ts';

export default function usePromo() {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>();
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState<string>();

  const applyPromoCode = async () => {
    try {
      const normalizedPromoCode = promoCode.trim().toUpperCase();

      if (!normalizedPromoCode) {
        setDiscountRate(0);
        setPromoCodeError('Wpisz kod promocyjny.');
        return;
      }

      const { data, error } = await validatePromoCode({ promo_code: normalizedPromoCode });

      if (error || !data) {
        setDiscountRate(0);
        setPromoCodeError('Nie udało się sprawdzić kodu promocyjnego.');
        return;
      }

      if (data.discount_rate === undefined || data.discount_rate === null) {
        setDiscountRate(0);
        setPromoCodeError('Nieprawidłowy kod promocyjny.');
        return;
      }

      setPromoCode(normalizedPromoCode);
      setAppliedPromoCode(normalizedPromoCode);
      setDiscountRate(data?.discount_rate);
      setPromoCodeError(undefined);
    } catch (error) {}
  };

  const changePromoCode = (value: string) => {
    setPromoCode(value);
    setPromoCodeError(undefined);
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromoCode(undefined);
    setDiscountRate(0);
    setPromoCodeError(undefined);
  };

  return {
    promoCode,
    appliedPromoCode,
    discountRate,
    promoCodeError,
    applyPromoCode,
    changePromoCode,
    removePromoCode,
  };
}
