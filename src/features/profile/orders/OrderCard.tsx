import { ChevronRight, ChevronDown } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice.ts';
import { type Order, ORDER_STATUS_MAP } from './orderTypes.ts';

type OrderCardProps = {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

export default function OrderCard({ order, isExpanded, onToggle, children }: OrderCardProps) {
  return (
    <div className="bg-app-surfaceElevated">
      <div
        className="flex items-center justify-between p-6 cursor-pointer select-none transition-colors hover:bg-app-surface"
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
          <p className="text-sm">{ORDER_STATUS_MAP[order.status]}</p>
          {isExpanded ? (
            <ChevronDown className="text-app-textMuted" />
          ) : (
            <ChevronRight className="text-app-textMuted" />
          )}
        </div>
      </div>
      {isExpanded && <div className="p-6 pt-0 border-t border-app-borderSoft">{children}</div>}
    </div>
  );
}
