import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.ts';

type Order = {
  id: string;
  date: string;
  price: number;
  status: string;
};

type OrderCardProps = {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

function OrderCard({ order, isExpanded, onToggle, children }: OrderCardProps) {
  return (
    <div className="bg-white">
      <div
        className="flex items-center justify-between p-6 transition-colors cursor-pointer hover:bg-slate-50 select-none"
        onClick={onToggle}
      >
        <div className="flex-1 text-left">
          <p className="text-lg">Zamówienie #{order.id}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-sm">{order.date}</p>
          <p className="text-sm">{formatPrice(order.price)}</p>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <p className="text-sm">{order.status}</p>
          {isExpanded ? (
            <ChevronDown className="text-slate-900" />
          ) : (
            <ChevronRight className="text-slate-400" />
          )}
        </div>
      </div>
      {isExpanded && <div className="p-6 pt-0 border-t border-slate-100">{children}</div>}
    </div>
  );
}

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders: Order[] = [
    { id: '1234567890', date: '06 lipca 2026', price: 126.0, status: 'Zakończono' },
    { id: '1234567891', date: '06 lipca 2026', price: 126.0, status: 'Nieudane' },
    { id: '1234567892', date: '06 lipca 2026', price: 126.0, status: 'Opłacone' },
  ];

  return (
    <div className="flex flex-col items-center w-full pt-12 text-slate-800">
      <h2 className="text-5xl text-center">Historia zamówień</h2>

      <div className="m-12 flex w-full max-w-[calc(100%-6rem)] flex-col gap-0.5 overflow-hidden rounded-xl bg-slate-300">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expandedOrder === order.id}
            onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="mt-4 text-slate-600">Szczegóły zamówienia</div>
          </OrderCard>
        ))}
      </div>
    </div>
  );
}
