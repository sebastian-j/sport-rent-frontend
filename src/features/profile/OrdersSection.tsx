import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getOrder, getOrders, type OrderResponse } from '../../api/orders.ts';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import PageSelector from '../../components/core/PageSelector.tsx';
import SectionTitle from '../../components/core/SectionTitle.tsx';
import { formatPrice } from '../../utils/formatPrice';
import { getErrorMessage } from '../../utils/getErrorMessage.ts';
import OrderCard from './orders/OrderCard.tsx';
import { type Order } from './orders/orderTypes.ts';

const PLACEHOLDER_PULSE_DURATION_SECONDS = 2.4;
const ORDER_DETAILS_PLACEHOLDER_HEIGHT = 132;
const ORDER_DETAILS_EXPAND_DURATION_SECONDS = 0.45;
const ORDER_DETAILS_CONTENT_FADE_DURATION_SECONDS = 0.2;
const PAGE_SIZE = 10;

const OrderDetailsPlaceholder = forwardRef<HTMLDivElement, { prefersReducedMotion: boolean }>(
  function OrderDetailsPlaceholder({ prefersReducedMotion }, ref) {
    return (
      <motion.div
        ref={ref}
        exit={{ opacity: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                duration: ORDER_DETAILS_CONTENT_FADE_DURATION_SECONDS,
                delay:
                  ORDER_DETAILS_EXPAND_DURATION_SECONDS -
                  ORDER_DETAILS_CONTENT_FADE_DURATION_SECONDS,
              }
        }
      >
        <span className="sr-only">Ładowanie szczegółów zamówienia…</span>
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative min-h-24 overflow-hidden rounded-lg bg-app-surfaceSoft"
        >
          <motion.div
            className="absolute inset-0 bg-app-surfaceElevated"
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: [0, 0.75, 0] }}
            transition={{
              duration: PLACEHOLDER_PULSE_DURATION_SECONDS,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </motion.div>
      </motion.div>
    );
  }
);

function OrderTotal({
  total,
  isLoading,
  prefersReducedMotion,
}: {
  total: number | null;
  isLoading: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="mt-2 flex items-center justify-between px-2 text-lg font-bold text-app-textStrong">
      <span>Suma zamówienia:</span>
      <AnimatePresence initial={false} mode="popLayout">
        {isLoading ? (
          <motion.span
            key="loading-total"
            aria-hidden="true"
            exit={{ opacity: 0 }}
            className="relative inline-block h-6 w-24 overflow-hidden rounded-md bg-app-surfaceSoft"
          >
            <motion.span
              className="absolute inset-0 bg-app-surfaceElevated"
              initial={{ opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: [0, 0.75, 0] }}
              transition={{
                duration: PLACEHOLDER_PULSE_DURATION_SECONDS,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </motion.span>
        ) : (
          <motion.span
            key="order-total"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            {total === null ? '—' : formatPrice(total)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderDetailsLoader({ orderId }: { orderId: string }) {
  const [details, setDetails] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(ORDER_DETAILS_PLACEHOLDER_HEIGHT);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setContentHeight(content.getBoundingClientRect().height);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getOrder(Number(orderId))
      .then(({ data, error }) => {
        if (error) {
          setError(getErrorMessage(error, 'Nieznany błąd'));
          console.error(error);
        } else if (data) {
          setDetails(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(getErrorMessage(error, 'Nieznany błąd'));
        console.error(error);
        setIsLoading(false);
      });
  }, [orderId]);

  return (
    <motion.div
      className="relative mt-4 box-content overflow-hidden border-t border-app-borderSoft pt-4"
      aria-busy={isLoading}
      aria-live="polite"
      initial={false}
      animate={{ height: contentHeight }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              height: {
                duration: ORDER_DETAILS_EXPAND_DURATION_SECONDS,
                ease: [0.22, 1, 0.36, 1],
              },
            }
      }
    >
      <div ref={contentRef}>
        <AnimatePresence initial={false} mode="popLayout">
          {isLoading ? (
            <OrderDetailsPlaceholder
              key="loading"
              prefersReducedMotion={prefersReducedMotion ?? false}
            />
          ) : error || !details ? (
            <motion.div
              key="error"
              role="alert"
              className="text-center text-sm text-app-danger"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {error || 'Brak szczegółowych danych.'}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              className="flex flex-col gap-3"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: ORDER_DETAILS_CONTENT_FADE_DURATION_SECONDS,
                      delay: ORDER_DETAILS_EXPAND_DURATION_SECONDS,
                      ease: 'easeOut',
                    }
              }
            >
              {details.instances.map((item, index) => {
                const startDate = new Date(item.start_date);
                const endDate = new Date(item.end_date);
                const diffTime = endDate.getTime() - startDate.getTime();
                const days = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
                const dailyPrice = item.price / days;
                const totalItemPrice = item.quantity * item.price;

                return (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="flex flex-col gap-2 rounded-lg bg-app-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || undefined}
                        alt={item.product_name}
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-app-borderSoft bg-app-surfaceSoft object-cover text-center text-[10px] leading-tight text-app-textMuted"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-app-textStrong">
                          {item.product_name}
                        </span>
                        <span className="text-xs text-app-textMuted">
                          Okres: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} (
                          {days} {days === 1 ? 'dzień' : 'dni'})
                        </span>
                        {item.size && (
                          <span className="text-xs text-app-textMuted">Rozmiar: {item.size}</span>
                        )}
                        <span className="text-xs text-app-textMuted">
                          Cena: {formatPrice(dailyPrice)} / dzień
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center text-right">
                      <span className="text-xs text-app-textMuted">{item.quantity} szt.</span>
                      <span className="text-base font-bold text-app-textStrong">
                        {formatPrice(totalItemPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        {(isLoading || details) && (
          <OrderTotal
            total={details?.total_price ?? null}
            isLoading={isLoading}
            prefersReducedMotion={prefersReducedMotion ?? false}
          />
        )}
      </div>
    </motion.div>
  );
}

function mapOrderToCard(order: OrderResponse): Order {
  return {
    id: String(order.id),
    date: new Date(order.created_at).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    price: order.total_price,
    status: order.status,
  };
}

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getOrders({
      page,
      pageSize: PAGE_SIZE,
    })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setError(getErrorMessage(error, 'Nie udało się pobrać historii zamówień.'));
        } else if (data) {
          setOrders(data.items.map(mapOrderToCard));
          setTotalPages(data.totalPages);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(getErrorMessage(error, 'Nie udało się pobrać historii zamówień.'));
        setIsLoading(false);
      });
  }, [page]);

  return (
    <div className="flex w-full flex-col items-center pt-6 text-app-text md:pt-12">
      <SectionTitle className="text-center text-app-text">Historia zamówień</SectionTitle>

      {isLoading ? (
        <div role="status" className="mt-12 text-center text-app-textMuted">
          Ładowanie historii <LoadingDots />
        </div>
      ) : error ? (
        <div className="mt-12 text-center text-app-danger">{error}</div>
      ) : (
        <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-surfaceSoft md:m-12 md:max-w-[calc(100%-6rem)]">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() =>
                setExpandedOrder((current) => (current === order.id ? null : order.id))
              }
            >
              <OrderDetailsLoader orderId={order.id} />
            </OrderCard>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-app-textMuted">Brak zamówień</div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center p-4">
              <PageSelector pageNumber={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
