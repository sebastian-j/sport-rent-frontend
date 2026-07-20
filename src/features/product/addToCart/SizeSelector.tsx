import type { ProductProps } from '../productProps.ts';

type ProductSize = NonNullable<ProductProps['sizes']>[number];

type SizeSelectorProps = {
  sizes: ProductSize[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
};

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <p className="text-base font-semibold text-app-text">Rozmiar</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((sizeOption) => (
          <button
            key={sizeOption.size}
            type="button"
            aria-pressed={selectedSize === sizeOption.size}
            className={
              selectedSize === sizeOption.size
                ? 'min-h-12 min-w-12 rounded-lg border border-app-text bg-app-text px-3 text-xl font-semibold text-app-surface'
                : 'min-h-12 min-w-12 rounded-lg border border-app-border bg-app-surfaceElevated px-3 text-xl font-semibold text-app-text [@media(hover:hover)]:hover:bg-app-surfaceSoft'
            }
            onClick={() => onSelect(sizeOption.size)}
          >
            {sizeOption.size}
          </button>
        ))}
      </div>
    </div>
  );
}
