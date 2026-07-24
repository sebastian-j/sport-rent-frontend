import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getLoyalty } from '../../api/loyalty.ts';
import { getProducts } from '../../api/product.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { getOrderInformation } from '../../features/cart/cartCalculations.ts';
import type { CartProduct } from '../../features/cart/cartTypes.ts';
import { POINTS_REQUIRED_PER_PLN } from '../../features/loyalty/constants.ts';
import InvoiceDetailsPanel from '../../features/orderSummary/InvoiceDetailsPanel.tsx';
import OrderPriceSummary from '../../features/orderSummary/OrderPriceSummary.tsx';
import {
  PAYMENT_METHODS,
  type PaymentMethodId,
} from '../../features/orderSummary/paymentMethods.ts';
import PaymentMethodsPanel from '../../features/orderSummary/PaymentMethodsPanel.tsx';
import PromoCodePanel from '../../features/orderSummary/PromoCodePanel.tsx';
import RecipientDetailsPanel from '../../features/orderSummary/RecipientDetailsPanel.tsx';
import SummaryProduct from '../../features/orderSummary/SummaryProduct.tsx';
import usePromo from '../../features/orderSummary/usePromo.ts';
import type {
  InvoiceDetails,
  RecipientDetails,
} from '../../features/userDetails/userDetailsTypes.ts';

const HEADER_OFFSET_PX = 64;
const PANEL_VIEWPORT_GAP_PX = 16;
const DESKTOP_BREAKPOINT_PX = 768;

const PROFILE_RECIPIENT_DETAILS: RecipientDetails = {
  firstName: 'Jan',
  lastName: 'Kowalski',
};

const INITIAL_INVOICE_DETAILS: InvoiceDetails = {
  ...PROFILE_RECIPIENT_DETAILS,
  company: 'Polar Sport',
  nip: '123456789',
  country: 'Polska',
  city: 'Kraków',
  addressLine1: 'ul. Kałuży 1',
  addressLine2: '',
  postalCode: '30-111',
};

const getDateAfterToday = (dayOffset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);

  return date;
};

export default function OrderSummaryPage() {
  const summaryPanelRef = useRef<HTMLDivElement>(null);
  const [recipientDetails, setRecipientDetails] =
    useState<RecipientDetails>(PROFILE_RECIPIENT_DETAILS);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>(INITIAL_INVOICE_DETAILS);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId>();
  const [summaryProducts, setSummaryProducts] = useState<CartProduct[]>([]);
  const {
    promoCode,
    appliedPromoCode,
    discountRate,
    promoCodeError,
    isPromoCodeValidating,
    applyPromoCode,
    changePromoCode,
    removePromoCode,
  } = usePromo();
  const cartPrice = getOrderInformation(summaryProducts).totalValue;
  const paymentPrice = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentMethodId
  )?.price;
  const discount = cartPrice * discountRate;
  const pointsRequired = Math.ceil((cartPrice - discount) * POINTS_REQUIRED_PER_PLN);
  const [points, setPoints] = useState(0);
  const [hasPointsLoadError, setHasPointsLoadError] = useState(false);
  const [isPointsLoading, setIsPointsLoading] = useState(true);

  useEffect(() => {
    getProducts().then(({ data }) => {
      if (data) {
        const filtered = data
          .filter((product) => product.id === 1 || product.id === 4)
          .map((product: any, index) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            price: product.price ?? 0,
            slug: product.slug,
            images: product.images ?? [],
            alt: product.alt ?? product.name,
            category: product.category ?? '',
            sizes: product.sizes ?? [],
            dates: [
              {
                id: index + 1,
                quantity: index === 0 ? 5 : 2,
                size: product.sizes?.[1]?.size ?? product.sizes?.[0]?.size ?? null,
                start_date: getDateAfterToday(3 + index * 5),
                end_date: getDateAfterToday(4 + index * 7),
              },
              ...(index === 0
                ? [
                    {
                      id: 2,
                      quantity: 1,
                      size: product.sizes?.[1]?.size ?? product.sizes?.[0]?.size ?? null,
                      start_date: getDateAfterToday(10),
                      end_date: getDateAfterToday(12),
                    },
                  ]
                : []),
            ],
          }));
        setSummaryProducts(filtered);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const summaryPanel = summaryPanelRef.current;
    if (!summaryPanel) return;

    const updateStickyPosition = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT_PX) {
        summaryPanel.style.top = '';
        return;
      }

      const bottomAlignedTop =
        window.innerHeight - summaryPanel.offsetHeight - PANEL_VIEWPORT_GAP_PX;
      summaryPanel.style.top = `${Math.min(HEADER_OFFSET_PX, bottomAlignedTop)}px`;
    };

    const resizeObserver = new ResizeObserver(updateStickyPosition);
    resizeObserver.observe(summaryPanel);
    window.addEventListener('resize', updateStickyPosition);
    updateStickyPosition();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyPosition);
      summaryPanel.style.top = '';
    };
  }, []);

  const handleRemovePromoCode = () => {
    removePromoCode();
    if (selectedPaymentMethodId === 'points') setSelectedPaymentMethodId(undefined);
  };

  useEffect(() => {
    let active = true;

    async function loadPoints() {
      try {
        const { data, error } = await getLoyalty();

        if (!active) return;

        if (error) {
          console.error(error);
          setHasPointsLoadError(true);
          return;
        }

        setPoints(data.balance);
      } catch (error) {
        if (!active) return;

        console.error(error);
        setHasPointsLoadError(true);
      } finally {
        if (active) setIsPointsLoading(false);
      }
    }

    void loadPoints();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-[78rem] px-6 py-6 md:px-8 md:py-12">
      <div className="grid items-start justify-center gap-6 md:grid-cols-[minmax(0,48rem)_minmax(18rem,24rem)] md:gap-8">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-6">
          <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
            <RecipientDetailsPanel
              details={recipientDetails}
              onDetailsChange={setRecipientDetails}
            />
          </ContentPanel>

          <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
            <InvoiceDetailsPanel
              enabled={wantsInvoice}
              details={invoiceDetails}
              onEnabledChange={setWantsInvoice}
              onDetailsChange={setInvoiceDetails}
            />
          </ContentPanel>

          <ContentPanel className="w-full px-3 py-4 sm:py-6 md:py-8">
            <PaymentMethodsPanel
              selectedMethodId={selectedPaymentMethodId}
              pointsRequired={pointsRequired}
              userPoints={points}
              isUserPointsLoading={isPointsLoading}
              hasUserPointsLoadError={hasPointsLoadError}
              onMethodChange={setSelectedPaymentMethodId}
            />
          </ContentPanel>
        </div>

        <ContentPanel
          ref={summaryPanelRef}
          className="w-full max-w-[48rem] gap-6 justify-self-center p-4 sm:p-6 md:sticky md:h-fit md:max-w-[24rem] md:justify-self-end md:self-start md:p-8"
        >
          <p className="text-2xl font-semibold text-app-textStrong">Podsumowanie</p>

          <div className="flex w-full flex-col gap-5">
            {summaryProducts.map((product) => (
              <SummaryProduct key={product.id} product={product} />
            ))}
          </div>

          <PromoCodePanel
            promoCode={promoCode}
            appliedCode={appliedPromoCode}
            error={promoCodeError}
            isValidating={isPromoCodeValidating}
            onPromoCodeChange={changePromoCode}
            onApply={applyPromoCode}
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
