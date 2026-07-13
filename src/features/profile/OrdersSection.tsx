import { useState } from 'react';
import OrderCard, { type Order } from './orders/OrderCard.tsx';

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders: Order[] = [
    { id: '1234567890', date: '06 lipca 2026', price: 126.0, status: 'FINISHED' },
    { id: '1234567891', date: '06 lipca 2026', price: 126.0, status: 'CANCELLED' },
    { id: '1234567892', date: '06 lipca 2026', price: 126.0, status: 'PAID' },
  ];

  return (
    <div className="flex flex-col items-center w-full pt-12 text-app-text">
      <p className="text-center text-5xl">Historia zamówień</p>

      <div className="m-12 flex w-full max-w-[calc(100%-6rem)] flex-col gap-0.5 overflow-hidden rounded-xl bg-app-surfaceSoft">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expandedOrder === order.id}
            onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="mt-4 text-app-textMuted">Szczegóły zamówienia</div>
          </OrderCard>
        ))}
      </div>
    </div>
  );
}
