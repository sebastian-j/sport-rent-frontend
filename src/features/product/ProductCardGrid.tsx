import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { PRODUCT_CARD_WIDTH } from './ProductCard.tsx';

const DEFAULT_MIN_SCALE = 0.6;
const DEFAULT_GAP = 16;

type ProductCardGridProps = {
  children: ReactNode;
  className?: string;
  minScale?: number;
  gap?: number;
};

export default function ProductCardGrid({
  children,
  className,
  minScale = DEFAULT_MIN_SCALE,
  gap = DEFAULT_GAP,
}: ProductCardGridProps) {
  const normalizedMinScale = Math.min(1, Math.max(0, minScale));
  const normalizedGap = Math.max(0, gap);
  const minCardWidth = PRODUCT_CARD_WIDTH * normalizedMinScale;
  const cardWidth = `clamp(${minCardWidth}px, calc((100cqw - ${normalizedGap}px) / 2), ${PRODUCT_CARD_WIDTH}px)`;

  return (
    <div className={twMerge('w-full px-4', className)} style={{ containerType: 'inline-size' }}>
      <div
        className="grid justify-center"
        style={{ gap: normalizedGap, gridTemplateColumns: `repeat(auto-fit, ${cardWidth})` }}
      >
        {children}
      </div>
    </div>
  );
}
