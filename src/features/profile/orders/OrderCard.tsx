import { ChevronRight, ChevronDown } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { formatPrice } from '../../../utils/formatPrice.ts';
import { useDisclosureScroll } from '../useDisclosureScroll.ts';
import { type Order, ORDER_STATUS_MAP } from './orderTypes.ts';

type OrderCardProps = {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

export default function OrderCard({ order, isExpanded, onToggle, children }: OrderCardProps) {
  const cardRef = useDisclosureScroll(isExpanded);
  const contentId = useId();

  return (
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated min-[961px]:scroll-mt-16">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full cursor-pointer select-none flex-col items-stretch gap-3 p-4 text-app-text transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 min-[961px]:flex-row min-[961px]:items-center min-[961px]:justify-between min-[961px]:gap-0 min-[961px]:p-6"
        onClick={onToggle}
      >
        <span className="text-left min-[961px]:flex-1">
          <span className="block text-lg">Zamówienie #{order.id}</span>
        </span>
        <span className="flex items-center justify-between gap-4 text-left min-[961px]:block min-[961px]:flex-1 min-[961px]:text-center">
          <span className="text-sm">{order.date}</span>
          <span className="hidden text-sm min-[961px]:block">{formatPrice(order.price)}</span>
        </span>
        <span className="flex items-center justify-between gap-4 min-[961px]:flex-1 min-[961px]:justify-end">
          <span className="text-sm min-[961px]:hidden">{formatPrice(order.price)}</span>
          <span className="flex items-center gap-4">
            <span className="text-sm">{ORDER_STATUS_MAP[order.status]}</span>
            {isExpanded ? (
              <ChevronDown aria-hidden="true" className="text-app-textMuted" />
            ) : (
              <ChevronRight aria-hidden="true" className="text-app-textMuted" />
            )}
          </span>
        </span>
      </button>
      {isExpanded && (
        <div
          id={contentId}
          className="border-t border-app-borderSoft p-4 pt-0 min-[961px]:p-6 min-[961px]:pt-0"
        >
          {children}
        </div>
      )}
    </div>
  );
}
