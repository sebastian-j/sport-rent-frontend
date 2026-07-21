import { useState } from 'react';

const PROMO_DISCOUNTS: Record<string, number> = {
  SPORT10: 0.1,
};

export default function usePromo() {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>();
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState<string>();

  const applyPromoCode = () => {
    const normalizedPromoCode = promoCode.trim().toUpperCase();
    const matchedDiscountRate = PROMO_DISCOUNTS[normalizedPromoCode];

    if (!normalizedPromoCode) {
      setDiscountRate(0);
      setPromoCodeError('Wpisz kod promocyjny.');
      return;
    }

    if (matchedDiscountRate === undefined) {
      setDiscountRate(0);
      setPromoCodeError('Nieprawidłowy kod promocyjny.');
      return;
    }

    setPromoCode(normalizedPromoCode);
    setAppliedPromoCode(normalizedPromoCode);
    setDiscountRate(matchedDiscountRate);
    setPromoCodeError(undefined);
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
