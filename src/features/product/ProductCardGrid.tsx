import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { PRODUCT_CARD_WIDTH } from './ProductCard.tsx';

const DEFAULT_GAP = 16;

function getColumnCount(containerWidth: number, itemCount: number, gap: number) {
  let columnCount = Math.min(1, itemCount);

  while (columnCount < itemCount) {
    const fullCurrentRowWidth = columnCount * PRODUCT_CARD_WIDTH + (columnCount - 1) * gap;

    if (containerWidth < fullCurrentRowWidth) break;

    columnCount += 1;
  }

  return columnCount;
}

type ProductCardGridProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  itemCount?: number;
};

export default function ProductCardGrid({
  children,
  className,
  gap = DEFAULT_GAP,
  itemCount,
}: ProductCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ width: 0, itemCount: 0 });
  const normalizedGap = Math.max(0, gap);
  const resolvedItemCount = itemCount ?? layout.itemCount;
  const columnCount = getColumnCount(layout.width, resolvedItemCount, normalizedGap);
  const cardWidth = columnCount
    ? `min(calc((100cqw - ${(columnCount - 1) * normalizedGap}px) / ${columnCount}), ${PRODUCT_CARD_WIDTH}px)`
    : `${PRODUCT_CARD_WIDTH}px`;

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateLayout = () => {
      const nextLayout = { width: grid.clientWidth, itemCount: grid.childElementCount };
      setLayout((currentLayout) =>
        currentLayout.width === nextLayout.width && currentLayout.itemCount === nextLayout.itemCount
          ? currentLayout
          : nextLayout
      );
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    const mutationObserver = new MutationObserver(updateLayout);
    resizeObserver.observe(grid);
    mutationObserver.observe(grid, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className={twMerge('w-full px-4', className)} style={{ containerType: 'inline-size' }}>
      <div
        ref={gridRef}
        className="grid justify-center"
        style={{ gap: normalizedGap, gridTemplateColumns: `repeat(auto-fit, ${cardWidth})` }}
      >
        {children}
      </div>
    </div>
  );
}
