import { ChevronRight, ChevronDown } from 'lucide-react';
import { type ReactNode, useEffect, useRef } from 'react';
import { formatPrice } from '../../../utils/formatPrice.ts';
import { scrollElementIntoViewIfBelow } from '../../../utils/scrollElementIntoViewIfBelow.ts';
import { type Order, ORDER_STATUS_MAP } from './orderTypes.ts';

type OrderCardProps = {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

export default function OrderCard({ order, isExpanded, onToggle, children }: OrderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded || !cardRef.current) return;

    return scrollElementIntoViewIfBelow(cardRef.current);
  }, [isExpanded]);

  return (
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated min-[961px]:scroll-mt-16">
      <div
        className="flex cursor-pointer select-none flex-col items-stretch gap-3 p-4 transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 min-[961px]:flex-row min-[961px]:items-center min-[961px]:justify-between min-[961px]:gap-0 min-[961px]:p-6"
        onClick={onToggle}
      >
        <div className="text-left min-[961px]:flex-1">
          <p className="text-lg">Zamówienie #{order.id}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-left min-[961px]:block min-[961px]:flex-1 min-[961px]:text-center">
          <p className="text-sm">{order.date}</p>
          <p className="hidden text-sm min-[961px]:block">{formatPrice(order.price)}</p>
        </div>
        <div className="flex items-center justify-between gap-4 min-[961px]:flex-1 min-[961px]:justify-end">
          <p className="text-sm min-[961px]:hidden">{formatPrice(order.price)}</p>
          <div className="flex items-center gap-4">
            <p className="text-sm">{ORDER_STATUS_MAP[order.status]}</p>
            {isExpanded ? (
              <ChevronDown className="text-app-textMuted" />
            ) : (
              <ChevronRight className="text-app-textMuted" />
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-app-borderSoft p-4 pt-0 min-[961px]:p-6 min-[961px]:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
