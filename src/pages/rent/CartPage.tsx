import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentPanel from '../../components/core/ContentPanel.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import {
  findFirstInvalidRentalDate,
  getOrderInformation,
  getProductInformation,
} from '../../features/cart/cartCalculations.ts';
import CartProductCard from '../../features/cart/CartProductCard.tsx';
import CartSummaryPanel from '../../features/cart/CartSummaryPanel.tsx';
import EmptyCartPanel from '../../features/cart/EmptyCartPanel.tsx';
import TermsPanel from '../../features/cart/TermsPanel.tsx';
import { useCart } from '../../features/cart/useCart.ts';
import { RENT_ROUTES } from '../../routes.ts';

export default function CartPage() {
  const {
    products,
    updateRentalDate,
    updateQuantity,
    updateSize,
    removeRentalDate,
    addRentalDate,
    removeProduct,
    status,
    error,
    isPending,
    mergeTargetId,
    retry,
  } = useCart();
  const [readTerms, setReadTerms] = useState(false);
  const [highlightTerms, setHighlightTerms] = useState(false);
  const termsRef = useRef<HTMLDivElement | null>(null);
  const rentalDateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  const orderInformation = getOrderInformation(products);

  const handleReadTerms = () => {
    setReadTerms(true);
  };

  const getRentalDateRefKey = (productSlug: string, dateId: number) => `${productSlug}-${dateId}`;

  const handleBuy = () => {
    if (isPending) return;
    const firstInvalidRentalDate = findFirstInvalidRentalDate(products);

    if (firstInvalidRentalDate) {
      const refKey = getRentalDateRefKey(
        firstInvalidRentalDate.productSlug,
        firstInvalidRentalDate.date.id
      );

      rentalDateRefs.current[refKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      return;
    }

    if (!readTerms) {
      termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightTerms(true);
      window.setTimeout(() => setHighlightTerms(false), 500);

      return;
    }

    navigate(RENT_ROUTES.summary);
  };

  return (
    <div className="mx-auto mb-12 flex w-full max-w-[100rem] flex-col">
      <p className="text-center mt-12 font-semibold text-5xl text-app-text">Koszyk</p>

      {status === 'loading' && (
        <p role="status" className="mt-12 text-center text-xl text-app-textMuted">
          Ładowanie koszyka <LoadingDots />
        </p>
      )}

      {status === 'error' && (
        <div role="alert" className="mt-12 flex flex-col items-center gap-4 text-app-danger">
          <p>{error ?? 'Nie udało się pobrać koszyka.'}</p>
          <button
            type="button"
            onClick={() => void retry()}
            className="rounded-lg bg-app-accent px-5 py-2 text-app-textInverted"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {status === 'ready' && error && (
        <p role="alert" className="mx-8 mt-6 text-center text-app-danger">
          {error}
        </p>
      )}

      {status === 'ready' && (
        <AnimatePresence initial={false} mode="wait">
          {products.length > 0 ? (
            <motion.div
              key="filled-cart"
              animate={{ height: 'auto', clipPath: 'inset(0 0 0% 0)' }}
              exit={{ height: 0, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ContentPanel className="relative mx-4 mt-12 items-stretch p-4 sm:mx-8 sm:p-8">
                <AnimatePresence initial={false} propagate>
                  {products.map((product, index) => {
                    const information = getProductInformation(product);

                    return (
                      <motion.div
                        key={product.slug}
                        initial={{
                          height: 0,
                          marginBottom: 0,
                          clipPath: 'inset(0 0 100% 0)',
                        }}
                        animate={{
                          height: 'auto',
                          marginBottom: index === products.length - 1 ? 0 : 16,
                          clipPath: 'inset(0 0 0% 0)',
                          scale: 1,
                        }}
                        exit={{
                          height: 0,
                          marginBottom: 0,
                          clipPath: 'inset(0 0 100% 0)',
                          scale: 0.98,
                        }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className="w-full overflow-hidden"
                      >
                        <CartProductCard
                          product={product}
                          information={information}
                          onQuantityChange={(dateId, quantity) =>
                            updateQuantity(product.slug, dateId, quantity)
                          }
                          onSizeChange={(dateId, size) => updateSize(product.slug, dateId, size)}
                          onDateChange={(dateId, field, value) =>
                            updateRentalDate(product.slug, dateId, field, value)
                          }
                          onRemoveDate={(dateId) => removeRentalDate(product.slug, dateId)}
                          onAddDate={() => addRentalDate(product.slug)}
                          onRemoveProduct={() => removeProduct(product.slug)}
                          actionsDisabled={isPending}
                          mergeTargetId={mergeTargetId}
                          getRentalDateRef={(dateId) => (element) => {
                            rentalDateRefs.current[getRentalDateRefKey(product.slug, dateId)] =
                              element;
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </ContentPanel>

              <TermsPanel
                readTerms={readTerms}
                highlighted={highlightTerms}
                onReadTerms={handleReadTerms}
                ref={termsRef}
              />

              <CartSummaryPanel
                orderInformation={orderInformation}
                onBuy={handleBuy}
                disabled={isPending}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <EmptyCartPanel onGoToOffer={() => navigate(RENT_ROUTES.home)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
