import { useState } from 'react';
import { PRODUCTS } from '../../assets/products/products.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { getOrderInformation } from '../../features/cart/cartCalculations.ts';
import type { CartProduct } from '../../features/cart/cartTypes.ts';
import { POINTS_REQUIRED_PER_PLN } from '../../features/loyalty/constants.ts';
import OrderPriceSummary from '../../features/orderSummary/OrderPriceSummary.tsx';
import PaymentMethodsPanel from '../../features/orderSummary/PaymentMethodsPanel.tsx';
import {
  PAYMENT_METHODS,
  type PaymentMethodId,
} from '../../features/orderSummary/paymentMethods.ts';
import PromoCodePanel from '../../features/orderSummary/PromoCodePanel.tsx';
import RecipientDetailsPanel, {
  type RecipientDetails,
} from '../../features/orderSummary/RecipientDetailsPanel.tsx';
import SummaryProduct from '../../features/orderSummary/SummaryProduct.tsx';

const PROMO_DISCOUNTS: Record<string, number> = {
  SPORT10: 0.1,
};

const USER_LOYALTY_POINTS = 7_200;

const PROFILE_RECIPIENT_DETAILS: RecipientDetails = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  country: 'Polska',
  city: 'Kraków',
  addressLine1: 'ul. Kałuży 1',
  addressLine2: '',
  postalCode: '30-111',
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
  const [recipientDetails, setRecipientDetails] =
    useState<RecipientDetails>(PROFILE_RECIPIENT_DETAILS);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId>();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>();
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState<string>();
  const cartPrice = getOrderInformation(SUMMARY_PRODUCTS).totalValue;
  const paymentPrice = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentMethodId
  )?.price;
  const discount = cartPrice * discountRate;
  const pointsRequired = Math.ceil((cartPrice - discount) * POINTS_REQUIRED_PER_PLN);

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
    if (selectedPaymentMethodId === 'points') setSelectedPaymentMethodId(undefined);
  };

  return (
    <main className="mx-auto w-full max-w-[78rem] px-6 py-6 min-[961px]:px-8 min-[961px]:py-12">
      <div className="grid items-start justify-center gap-6 min-[961px]:grid-cols-[minmax(0,48rem)_minmax(18rem,24rem)] min-[961px]:gap-8">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-6">
          <ContentPanel className="w-full p-4 sm:p-6 min-[961px]:p-8">
            <RecipientDetailsPanel
              details={recipientDetails}
              onDetailsChange={setRecipientDetails}
            />
          </ContentPanel>

          <ContentPanel className="w-full px-3 py-4 sm:py-6 min-[961px]:py-8">
            <PaymentMethodsPanel
              selectedMethodId={selectedPaymentMethodId}
              pointsRequired={pointsRequired}
              userPoints={USER_LOYALTY_POINTS}
              onMethodChange={setSelectedPaymentMethodId}
            />
          </ContentPanel>
        </div>

        <ContentPanel className="w-full max-w-[48rem] gap-6 justify-self-center p-4 sm:p-6 min-[961px]:max-w-[24rem] min-[961px]:justify-self-end min-[961px]:p-8">
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

          <OrderPriceSummary
            cartPrice={cartPrice}
            paymentPrice={paymentPrice}
            discount={discount}
            canBuy={selectedPaymentMethodId !== undefined}
          />
        </ContentPanel>
      </div>
    </main>
  );
}
