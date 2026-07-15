import { useState } from 'react';
import { PRODUCTS } from '../../assets/products/products.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { getOrderInformation } from '../../features/cart/cartCalculations.ts';
import type { CartProduct } from '../../features/cart/cartTypes.ts';
import OrderPriceSummary from '../../features/orderSummary/OrderPriceSummary.tsx';
import PromoCodePanel from '../../features/orderSummary/PromoCodePanel.tsx';
import SummaryProduct from '../../features/orderSummary/SummaryProduct.tsx';

const PROMO_DISCOUNTS: Record<string, number> = {
  SPORT10: 0.1,
};

const SUMMARY_PRODUCTS: CartProduct[] = PRODUCTS.filter(
  (product) => product.id === 1 || product.id === 4
).map((product, index) => ({
  ...product,
  dates: [
    {
      id: index + 1,
      quantity: index === 0 ? 5 : 2,
      size: product.sizes?.[1]?.size ?? product.sizes?.[0]?.size ?? null,
      start_date: new Date(2026, 6, 15 + index * 5),
      end_date: new Date(2026, 6, 16 + index * 7),
    },
    ...(index === 0
      ? [
          {
            id: 2,
            quantity: 1,
            size: product.sizes?.[1]?.size ?? product.sizes?.[0]?.size ?? null,
            start_date: new Date(2026, 6, 25),
            end_date: new Date(2026, 6, 27),
          },
        ]
      : []),
  ],
}));

export default function OrderSummaryPage() {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>();
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState<string>();
  const cartPrice = getOrderInformation(SUMMARY_PRODUCTS).totalValue;
  const discount = cartPrice * discountRate;

  const handleApplyPromoCode = () => {
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

  const handlePromoCodeChange = (value: string) => {
    setPromoCode(value);
    setPromoCodeError(undefined);
  };

  const handleRemovePromoCode = () => {
    setPromoCode('');
    setAppliedPromoCode(undefined);
    setDiscountRate(0);
    setPromoCodeError(undefined);
  };

  return (
    <main className="mx-auto w-full max-w-[84rem] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-start justify-center gap-6 lg:grid-cols-[minmax(0,58rem)_minmax(18rem,24rem)] lg:gap-8">
        <div className="flex w-full max-w-[58rem] flex-col gap-6">
          <ContentPanel className="w-full">
            <p className="text-2xl font-semibold text-app-textStrong">Dane odbiorcy</p>
          </ContentPanel>

          <ContentPanel className="w-full">
            <p className="text-2xl font-semibold text-app-textStrong">Płatność</p>
            {/*[radioButton name ---------- logo price]*/}
          </ContentPanel>
        </div>

        <ContentPanel className="w-full max-w-[24rem] gap-6 justify-self-center lg:justify-self-end">
          <p className="text-2xl font-semibold text-app-textStrong">Podsumowanie</p>

          <div className="flex w-full flex-col gap-5">
            {SUMMARY_PRODUCTS.map((product) => (
              <SummaryProduct key={product.id} product={product} />
            ))}
          </div>

          <PromoCodePanel
            promoCode={promoCode}
            appliedCode={appliedPromoCode}
            error={promoCodeError}
            onPromoCodeChange={handlePromoCodeChange}
            onApply={handleApplyPromoCode}
            onRemove={handleRemovePromoCode}
          />

          <OrderPriceSummary cartPrice={cartPrice} discount={discount} />
        </ContentPanel>
      </div>
    </main>
  );
}
