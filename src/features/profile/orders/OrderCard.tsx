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
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated lg:scroll-mt-16">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full cursor-pointer select-none flex-col items-stretch gap-3 p-4 text-app-text transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-4 lg:p-6"
        onClick={onToggle}
      >
        <span className="min-w-0 text-left">
          <span className="block text-lg [overflow-wrap:anywhere]">Zamówienie #{order.id}</span>
        </span>
        <span className="flex min-w-0 items-center justify-between gap-4 text-left lg:block lg:text-center">
          <span className="text-sm">{order.date}</span>
          <span className="hidden text-sm lg:block">{formatPrice(order.price)}</span>
        </span>
        <span className="flex min-w-0 items-center justify-between gap-4 lg:justify-end">
          <span className="text-sm lg:hidden">{formatPrice(order.price)}</span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 text-sm">{ORDER_STATUS_MAP[order.status]}</span>
            {isExpanded ? (
              <ChevronDown aria-hidden="true" className="shrink-0 text-app-textMuted" />
            ) : (
              <ChevronRight aria-hidden="true" className="shrink-0 text-app-textMuted" />
            )}
          </span>
        </span>
      </button>
      {isExpanded && (
        <div id={contentId} className="border-t border-app-borderSoft p-4 pt-0 lg:p-6 lg:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
