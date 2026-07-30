import { useEffect, useState } from 'react';

import { getOrderDetails, getUserHistory, type OrderDetailResponse } from '../../api/user.ts';
import { formatPrice } from '../../utils/formatPrice';
import OrderCard from './orders/OrderCard.tsx';
import { type Order, type OrderStatus } from './orders/orderTypes.ts';

function OrderDetailsLoader({ orderId }: { orderId: string }) {
  const [details, setDetails] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getOrderDetails(Number(orderId))
      .then(({ data, error }) => {
        if (error) {
          setError((error as any)?.detail.msg || 'Nieznany błąd');
          console.error(error);
        } else if (data) {
          setDetails(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        setIsLoading(false);
      });
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mt-4 text-center text-sm text-app-textMuted">Ładowanie szczegółów...</div>
    );
  }

  if (error || !details) {
    return (
      <div className="mt-4 text-center text-sm text-app-danger">
        {error || 'Brak szczegółowych danych.'}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-app-borderSoft pt-4">
      {details.items.map((item, index) => {
        const startDate = new Date(item.start_date);
        const endDate = new Date(item.end_date);
        const diffTime = endDate.getTime() - startDate.getTime();
        const days = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
        const dailyPrice = item.unit_price / days;
        const totalItemPrice = item.quantity * item.unit_price;

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
                <span className="font-semibold text-app-textStrong">{item.product_name}</span>
                <span className="text-xs text-app-textMuted">
                  Okres: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} ({days}{' '}
                  {days === 1 ? 'dzień' : 'dni'})
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
      <div className="mt-2 flex justify-between px-2 text-lg font-bold text-app-textStrong">
        <span>Suma zamówienia:</span>
        <span>{formatPrice(details.total)}</span>
      </div>
    </div>
  );
}

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserHistory()
      .then(({ data, error }) => {
        if (error) {
          setError(error);
        } else if (data) {
          const fetchedOrders: Order[] = data.map((item) => ({
            id: String(item.id),
            date: new Date(item.created_at).toLocaleDateString('pl-PL', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            price: item.total,
            status: item.status as OrderStatus,
          }));
          setOrders(fetchedOrders.reverse());
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex w-full flex-col items-center pt-6 text-app-text md:pt-12">
      <p className="text-center text-3xl md:text-5xl">Historia zamówień</p>

      {isLoading ? (
        <div className="mt-12 text-center text-app-textMuted">Ładowanie historii...</div>
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
              {expandedOrder === order.id && <OrderDetailsLoader orderId={order.id} />}
            </OrderCard>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-app-textMuted">Brak zamówień</div>
          )}
        </div>
      )}
    </div>
  );
}
