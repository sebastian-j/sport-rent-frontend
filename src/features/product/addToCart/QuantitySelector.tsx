import { CircleMinus, CirclePlus } from 'lucide-react';

type QuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const QUANTITY_BUTTON_CLASSES =
  'flex h-11 w-11 items-center justify-center text-app-text transition-[filter] [@media(hover:hover)]:enabled:hover:brightness-150';

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  return (
    <div className="my-[0.5vh] grid w-full max-w-xl grid-cols-2 items-center gap-x-3">
      <p className="text-base font-semibold text-app-text">Liczba</p>
      <div className="flex flex-row items-center justify-self-end gap-2">
        <button
          type="button"
          aria-label="Zmniejsz liczbę sztuk"
          disabled={quantity <= 1}
          onClick={onDecrease}
          className={`${QUANTITY_BUTTON_CLASSES} disabled:opacity-40`}
        >
          <CircleMinus className="h-7 w-7" />
        </button>
        <span className="w-8 text-center text-base font-semibold text-app-text">{quantity}</span>
        <button
          type="button"
          aria-label="Zwiększ liczbę sztuk"
          onClick={onIncrease}
          className={QUANTITY_BUTTON_CLASSES}
        >
          <CirclePlus className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
