import { Minus, Trash2, X } from 'lucide-react';
import type { Ref } from 'react';

import DatePickerElem from '../../components/core/DatePickerElem.tsx';
import Select from '../../components/core/Select.tsx';
import type { ProductProps } from '../product/productProps.ts';
import { isRentalDateValid } from './rentalDate.ts';
import type { RentalDate } from './rentalDate.ts';

type ProductRentalDateProps = {
  date: RentalDate;
  productName: string;
  productSizes?: ProductProps['sizes'];
  containerRef?: Ref<HTMLDivElement>;
  onQuantityChange: (quantity: number) => void;
  onSizeChange: (size: string) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRemove: () => void;
};

export default function ProductRentalDate({
  date,
  productName,
  productSizes,
  containerRef,
  onQuantityChange,
  onSizeChange,
  onStartDateChange,
  onEndDateChange,
  onRemove,
}: ProductRentalDateProps) {
  const requiresSize = Boolean(productSizes?.length);

  return (
    <div
      ref={containerRef}
      className={`grid w-full grid-cols-2 items-center gap-3 rounded-lg border-2 border-app-textInverted/40 px-2 py-3 md:flex md:flex-row md:justify-between md:border-0 md:py-1 lg:gap-4 ${
        isRentalDateValid(date, requiresSize) ? '' : 'bg-app-danger/20'
      }`}
    >
      <div className="col-span-2 grid grid-cols-2 items-center gap-3 md:contents">
        <input
          type="number"
          min={1}
          step={1}
          value={date.quantity}
          onChange={(event) => {
            const quantity = event.currentTarget.valueAsNumber;
            if (!Number.isNaN(quantity)) onQuantityChange(Math.max(1, quantity));
          }}
          aria-label={`Liczba sztuk: ${productName}`}
          className={`h-12 rounded-xl bg-app-surface px-2 text-center text-2xl text-app-text outline-none md:w-24 lg:w-16 ${
            requiresSize ? 'w-full' : 'col-span-2 w-1/2 justify-self-center'
          }`}
        />

        {productSizes && productSizes.length > 0 && (
          <Select
            value={date.size ?? ''}
            onChange={onSizeChange}
            ariaLabel={`Rozmiar: ${productName}`}
            placeholder="--"
            options={productSizes.map((sizeOption) => ({
              value: sizeOption.size,
              label: sizeOption.size,
            }))}
            className="w-full md:w-24 lg:w-20"
          />
        )}
      </div>

      <X className="col-span-2 shrink-0 justify-self-center md:col-span-1" />

      <div className="col-span-2 flex min-w-0 items-center gap-2 md:w-auto md:flex-1 lg:gap-4">
        <DatePickerElem
          selected={date.start_date}
          onChange={onStartDateChange}
          placeholder="Data początkowa"
          className="px-2 text-sm xl:px-4 xl:text-lg"
          wrapperClassName="md:w-auto md:flex-1"
        />
        <Minus className="shrink-0" />

        <DatePickerElem
          selected={date.end_date}
          minDate={date.start_date ?? new Date()}
          onChange={onEndDateChange}
          placeholder="Data końcowa"
          className="px-2 text-sm xl:px-4 xl:text-lg"
          wrapperClassName="md:w-auto md:flex-1"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Usuń termin dla ${productName}`}
        className="col-span-2 self-center justify-self-center rounded-lg p-2 transition-colors hover:bg-app-cartCard md:col-span-1 md:self-auto"
      >
        <Trash2 />
      </button>
    </div>
  );
}
