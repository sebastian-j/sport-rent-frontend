import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCart } from '../../api/cart.ts';
import { getLoyalty } from '../../api/loyalty.ts';
import { createOrder, startOrderPayment } from '../../api/orders.ts';
import { getUser } from '../../api/user.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { getOrderInformation } from '../../features/cart/cartCalculations.ts';
import { mapCartProduct } from '../../features/cart/cartMappers.ts';
import type { CartProduct } from '../../features/cart/cartTypes.ts';
import {
  MAX_POINTS_PAYMENT_SHARE,
  POINTS_REQUIRED_PER_PLN,
} from '../../features/loyalty/constants.ts';
import InvoiceDetailsPanel from '../../features/orderSummary/InvoiceDetailsPanel.tsx';
import LoyaltyPointsPanel from '../../features/orderSummary/LoyaltyPointsPanel.tsx';
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
import {
  mapInvoiceDetails,
  mapRecipientDetails,
} from '../../features/userDetails/userDetailsMappers.ts';
import type {
  InvoiceDetails,
  RecipientDetails,
} from '../../features/userDetails/userDetailsTypes.ts';
import { RENT_ROUTES } from '../../routes.ts';
import { getErrorMessage } from '../../utils/getErrorMessage.ts';

const HEADER_OFFSET_PX = 64;
const PANEL_VIEWPORT_GAP_PX = 16;
const DESKTOP_BREAKPOINT_PX = 768;

type LoadedUserDetails = {
  recipient: RecipientDetails;
  invoice: InvoiceDetails;
};

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const summaryPanelRef = useRef<HTMLDivElement>(null);
  const [userDetails, setUserDetails] = useState<LoadedUserDetails | null>(null);
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(true);
  const [userDetailsLoadError, setUserDetailsLoadError] = useState<string | null>(null);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId>();
  const [summaryProducts, setSummaryProducts] = useState<CartProduct[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartLoadError, setCartLoadError] = useState<string | null>(null);
  const cartPrice = getOrderInformation(summaryProducts).totalValue;
  const {
    promoCode,
    appliedPromoCode,
    promoDiscount,
    promoCodeError,
    isPromoCodeValidating,
    applyPromoCode,
    changePromoCode,
    removePromoCode,
  } = usePromo(cartPrice);
  const paymentPrice = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentMethodId
  )?.price;
  const calculatedDiscount =
    promoDiscount?.type === 'PERCENTAGE'
      ? cartPrice * promoDiscount.value
      : (promoDiscount?.value ?? 0);
  const discount = Math.min(cartPrice, Math.round(calculatedDiscount * 100) / 100);
  const [points, setPoints] = useState(0);
  const [pointsToSpend, setPointsToSpend] = useState(0);
  const [lifetimeQualifyingSpend, setLifetimeQualifyingSpend] = useState(0);
  const [unlockSpendRequired, setUnlockSpendRequired] = useState(500);
  const [redemptionUnlocked, setRedemptionUnlocked] = useState(false);
  const [pointsLoadError, setPointsLoadError] = useState<string | null>(null);
  const [isPointsLoading, setIsPointsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const maximumPointsForOrder = redemptionUnlocked
    ? Math.min(
        points,
        Math.floor((cartPrice - discount) * MAX_POINTS_PAYMENT_SHARE * POINTS_REQUIRED_PER_PLN)
      )
    : 0;
  const pointsDiscount = pointsToSpend / POINTS_REQUIRED_PER_PLN;

  useEffect(
    () => setPointsToSpend((current) => Math.min(current, maximumPointsForOrder)),
    [maximumPointsForOrder]
  );

  const loadSummaryCart = useCallback(async () => {
    setIsCartLoading(true);
    setCartLoadError(null);
    try {
      const result = await getCart();
      if (result.error || !result.data) {
        throw new Error('Nie udało się pobrać koszyka.');
      }
      const cart = result.data.map(mapCartProduct);
      if (cart.length === 0) {
        navigate(RENT_ROUTES.cart, { replace: true });
        return;
      }
      setSummaryProducts(cart);
    } catch (error) {
      setCartLoadError(
        error instanceof Error ? error.message : 'Nie udało się pobrać podsumowania koszyka.'
      );
    } finally {
      setIsCartLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadSummaryCart();
  }, [loadSummaryCart]);

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
  };

  const handleBuy = async () => {
    if (isBuying || selectedPaymentMethodId === undefined || !userDetails) return;

    setIsBuying(true);
    setBuyError(null);

    try {
      const { data, error } = await createOrder({
        recipient: {
          first_name: userDetails.recipient.firstName,
          last_name: userDetails.recipient.lastName,
        },
        points_to_spend: pointsToSpend,
        promo_code: appliedPromoCode || null,
        address: wantsInvoice
          ? {
              first_name: userDetails.invoice.firstName,
              last_name: userDetails.invoice.lastName,
              first_line: userDetails.invoice.addressLine1,
              second_line: userDetails.invoice.addressLine2 || null,
              postal_code: userDetails.invoice.postalCode,
              city: userDetails.invoice.city,
              country: userDetails.invoice.country,
              company: userDetails.invoice.company || null,
              nip: userDetails.invoice.nip || null,
            }
          : null,
      });

      if (error || !data) {
        setBuyError(getErrorMessage(error, 'Nie udało się złożyć zamówienia.'));
        return;
      }

      const paymentResult = await startOrderPayment(data.id);
      if (paymentResult.error || !paymentResult.data) {
        setBuyError(
          getErrorMessage(
            paymentResult.error,
            `Zamówienie #${data.id} zostało utworzone, ale nie udało się rozpocząć płatności.`
          )
        );
        return;
      }

      if (paymentResult.data.redirect_url) {
        window.location.assign(paymentResult.data.redirect_url);
        return;
      }

      if (paymentResult.data.status !== 'SUCCEEDED') {
        setBuyError('Płatność oczekuje na potwierdzenie.');
        return;
      }

      navigate(`${RENT_ROUTES.profile}?section=orders`);
    } catch (error) {
      setBuyError(getErrorMessage(error, 'Nie udało się złożyć zamówienia.'));
    } finally {
      setIsBuying(false);
    }
  };

  const loadUserDetails = useCallback(async () => {
    setIsUserDetailsLoading(true);
    setUserDetailsLoadError(null);

    try {
      const { data, error } = await getUser();

      if (error || !data) {
        setUserDetailsLoadError(getErrorMessage(error, 'Nie udało się pobrać danych użytkownika.'));
        return;
      }

      setUserDetails({
        recipient: mapRecipientDetails(data),
        invoice: mapInvoiceDetails(data),
      });
    } catch (error) {
      setUserDetailsLoadError(getErrorMessage(error, 'Nie udało się pobrać danych użytkownika.'));
    } finally {
      setIsUserDetailsLoading(false);
    }
  }, []);

  const loadPoints = useCallback(async () => {
    setIsPointsLoading(true);
    setPointsLoadError(null);

    try {
      const { data, error } = await getLoyalty();

      if (error || !data) {
        setPointsLoadError(getErrorMessage(error, 'Nie udało się pobrać liczby punktów.'));
        return;
      }

      setPoints(data.balance);
      setLifetimeQualifyingSpend(data.lifetime_qualifying_spend);
      setUnlockSpendRequired(data.unlock_spend_required);
      setRedemptionUnlocked(data.redemption_unlocked);
    } catch (error) {
      setPointsLoadError(getErrorMessage(error, 'Nie udało się pobrać liczby punktów.'));
    } finally {
      setIsPointsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUserDetails();
    void loadPoints();
  }, [loadUserDetails, loadPoints]);

  return (
    <main className="mx-auto w-full max-w-[78rem] px-6 py-6 md:px-8 md:py-12">
      <div className="grid items-start justify-center gap-6 md:grid-cols-[minmax(0,48rem)_minmax(18rem,24rem)] md:gap-8">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-6">
          {isUserDetailsLoading && (
            <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
              <p role="status" className="text-center text-app-text">
                Ładowanie danych użytkownika <LoadingDots />
              </p>
            </ContentPanel>
          )}
          {userDetailsLoadError && (
            <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
              <div role="alert" className="flex flex-col gap-3 text-app-danger">
                <p>{userDetailsLoadError}</p>
                <button
                  type="button"
                  onClick={() => void loadUserDetails()}
                  className="rounded-lg bg-app-accent px-4 py-2 text-app-textInverted"
                >
                  Spróbuj ponownie
                </button>
              </div>
            </ContentPanel>
          )}
          {userDetails && (
            <>
              <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
                <RecipientDetailsPanel
                  details={userDetails.recipient}
                  onDetailsChange={(recipient) =>
                    setUserDetails((current) => (current ? { ...current, recipient } : current))
                  }
                />
              </ContentPanel>

              <ContentPanel className="w-full p-4 sm:p-6 md:p-8">
                <InvoiceDetailsPanel
                  enabled={wantsInvoice}
                  details={userDetails.invoice}
                  onEnabledChange={setWantsInvoice}
                  onDetailsChange={(invoice) =>
                    setUserDetails((current) => (current ? { ...current, invoice } : current))
                  }
                />
              </ContentPanel>
            </>
          )}

          <ContentPanel className="w-full px-3 py-4 sm:py-6 md:py-8">
            <LoyaltyPointsPanel
              balance={points}
              pointsToSpend={pointsToSpend}
              maximumPointsForOrder={maximumPointsForOrder}
              lifetimeQualifyingSpend={lifetimeQualifyingSpend}
              unlockSpendRequired={unlockSpendRequired}
              redemptionUnlocked={redemptionUnlocked}
              isLoading={isPointsLoading}
              loadError={pointsLoadError}
              onPointsChange={setPointsToSpend}
            />

            <div className="my-6 border-t border-app-borderSoft" />

            <PaymentMethodsPanel
              selectedMethodId={selectedPaymentMethodId}
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
            {isCartLoading && (
              <p role="status">
                Ładowanie koszyka <LoadingDots />
              </p>
            )}
            {cartLoadError && (
              <div role="alert" className="flex flex-col gap-3 text-app-danger">
                <p>{cartLoadError}</p>
                <button
                  type="button"
                  onClick={() => void loadSummaryCart()}
                  className="rounded-lg bg-app-accent px-4 py-2 text-app-textInverted"
                >
                  Spróbuj ponownie
                </button>
              </div>
            )}
            {!isCartLoading &&
              !cartLoadError &&
              summaryProducts.map((product) => (
                <SummaryProduct key={product.slug} product={product} />
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
            discount={discount + pointsDiscount}
            canBuy={
              selectedPaymentMethodId !== undefined &&
              !isCartLoading &&
              !cartLoadError &&
              userDetails !== null
            }
            isBuying={isBuying}
            buyError={buyError}
            onBuy={() => void handleBuy()}
          />
        </ContentPanel>
      </div>
    </main>
  );
}
