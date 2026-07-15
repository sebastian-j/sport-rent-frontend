import { useState } from 'react';
import { PRODUCTS } from '../../assets/products/products.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import type { CartProduct } from '../../features/cart/cartTypes.ts';
import PromoCodePanel from '../../features/orderSummary/PromoCodePanel.tsx';
import SummaryProduct from '../../features/orderSummary/SummaryProduct.tsx';

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

          <PromoCodePanel promoCode={promoCode} onPromoCodeChange={setPromoCode} />

          {/*TODO: Summary*/}
        </ContentPanel>
      </div>
    </main>
  );
}
