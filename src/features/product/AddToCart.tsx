import { useState } from 'react';
import { CircleMinus, CirclePlus } from 'lucide-react';
import ButtonCore from '../../components/core/ButtonCore';
import { type ProductProps } from './productProps';
import { isDateAfter, isDateInPast } from '../cart/rentalDate.ts';
import { getInclusiveDayCount } from '../cart/cartCalculations.ts';
import DatePickerElem from '../../components/core/DatePickerElem.tsx';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { formatPrice } from '../../utils/formatPrice.ts';

export default function AddToCart({ product }: { product: ProductProps }) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const isSizeSelectionRequired = Boolean(product.sizes?.length && !selectedSize);
  const rentalDayCount = getInclusiveDayCount(startDate, endDate);
  const totalPrice = rentalDayCount * quantity * product.price;
  const rentalDayLabel = rentalDayCount === 1 ? 'dzień' : 'dni';

  const handleAddToCart = () => {
    if (isDateAfter(startDate, endDate)) {
      alert('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
      return;
    }

    if (isDateInPast(startDate)) {
      alert('Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data.');
      return;
    }

    if (isSizeSelectionRequired) {
      alert('Proszę wybrać rozmiar produktu.');
      return;
    }

    alert(
      `Dodano ${quantity} sztuk produktu ${product.name}${selectedSize ? ` o rozmiarze ${selectedSize}` : ''} do koszyka na okres od ${startDate.toLocaleDateString('pl')} do ${endDate.toLocaleDateString('pl')}.`
    );
  };

  return (
    <ContentPanel className="w-full gap-2 p-4 min-[961px]:px-20">
      <p className="text-center text-3xl font-semibold text-app-text">{product.price} zł/doba</p>
      <div className="grid w-full max-w-xl grid-cols-2 gap-x-3 gap-y-1">
        <p className="text-base font-semibold text-app-text">Data rozpoczęcia</p>
        <p className="text-base font-semibold text-app-text">Data zakończenia</p>
        <DatePickerElem
          selected={startDate}
          onChange={(date: Date | null) => {
            if (!date) return;

            setStartDate(date);

            if (isDateAfter(date, endDate)) {
              setEndDate(date);
            }
          }}
          minDate={new Date()}
          wrapperClassName="w-full min-w-0"
          className="h-auto rounded-lg border border-app-borderSoft bg-app-surface p-2 text-left text-base font-semibold text-app-text"
        />
        <DatePickerElem
          selected={endDate}
          onChange={(date: Date | null) => date && setEndDate(date)}
          minDate={startDate}
          wrapperClassName="w-full min-w-0"
          className="h-auto rounded-lg border border-app-borderSoft bg-app-surface p-2 text-left text-base font-semibold text-app-text"
        />
      </div>
      <div className="my-[0.5vh] grid w-full max-w-xl grid-cols-2 items-center gap-x-3">
        <div className="text-base font-semibold text-app-text">
          <p> Liczba </p>
        </div>
        <div className="flex flex-row items-center justify-self-end gap-2">
          <button
            type="button"
            aria-label="Zmniejsz liczbę sztuk"
            disabled={quantity <= 1}
            onClick={() => setQuantity((currentQuantity) => currentQuantity - 1)}
            className="flex h-11 w-11 items-center justify-center text-app-text transition-[filter] [@media(hover:hover)]:enabled:hover:brightness-150 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CircleMinus className="h-7 w-7" />
          </button>
          <span className="w-8 text-center text-base font-semibold text-app-text">{quantity}</span>
          <button
            type="button"
            aria-label="Zwiększ liczbę sztuk"
            onClick={() => setQuantity((currentQuantity) => currentQuantity + 1)}
            className="flex h-11 w-11 items-center justify-center text-app-text transition-[filter] [@media(hover:hover)]:hover:brightness-150"
          >
            <CirclePlus className="h-7 w-7" />
          </button>
        </div>
      </div>
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex w-full max-w-xl flex-col gap-2">
          <p className="text-base font-semibold text-app-text">Rozmiar</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((sizeOption) => (
              <button
                key={sizeOption.size}
                type="button"
                aria-pressed={selectedSize === sizeOption.size}
                className={
                  selectedSize === sizeOption.size
                    ? 'min-h-12 min-w-12 rounded-lg border border-app-text bg-app-text px-3 text-xl font-semibold text-app-surface'
                    : 'min-h-12 min-w-12 rounded-lg border border-app-border bg-app-surfaceElevated px-3 text-xl font-semibold text-app-text [@media(hover:hover)]:hover:bg-app-surfaceSoft'
                }
                onClick={() =>
                  setSelectedSize((currentSize) =>
                    currentSize === sizeOption.size ? null : sizeOption.size
                  )
                }
              >
                {sizeOption.size}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid w-full max-w-xl grid-cols-2 items-center gap-x-3 border-t border-app-borderSoft pt-3">
        <div>
          <p className="text-base font-semibold text-app-text">Cena łączna</p>
          <p className="text-sm text-app-textMuted">
            {rentalDayCount} {rentalDayLabel} × {quantity} szt.
          </p>
        </div>
        <p className="justify-self-end text-xl font-semibold text-app-text">
          {formatPrice(totalPrice)}
        </p>
      </div>
      <ButtonCore
        text="Dodaj do koszyka"
        onClick={handleAddToCart}
        disabled={isSizeSelectionRequired}
        className="mb-[1vh] mt-[1vh] w-full max-w-xl p-[1.5vh] text-base disabled:cursor-not-allowed disabled:opacity-50"
      />
    </ContentPanel>
  );
}
