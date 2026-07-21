import { useState } from 'react';
import OrderCard from './orders/OrderCard.tsx';
import { type Order } from './orders/orderTypes.ts';

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders: Order[] = [
    { id: '1234567890', date: '06 lipca 2026', price: 126.0, status: 'FINISHED' },
    { id: '1234567891', date: '06 lipca 2026', price: 126.0, status: 'CANCELLED' },
    { id: '1234567892', date: '06 lipca 2026', price: 126.0, status: 'PAID' },
  ];

  return (
    <div className="flex w-full flex-col items-center pt-6 text-app-text md:pt-12">
      <p className="text-center text-3xl md:text-5xl">Historia zamówień</p>

      <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-surfaceSoft md:m-12 md:max-w-[calc(100%-6rem)]">
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
