import { Minus, Trash2, X } from 'lucide-react';
import DatePickerElem from '../core/DatePickerElem.tsx';
import { isRentalDateValid } from './rentalDate.ts';
import type { RentalDate } from './rentalDate.ts';

type ProductRentalDateProps = {
  date: RentalDate;
  productName: string;
  onQuantityChange: (quantity: number) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRemove: () => void;
};

export default function ProductRentalDate({
  date,
  productName,
  onQuantityChange,
  onStartDateChange,
  onEndDateChange,
  onRemove,
}: ProductRentalDateProps) {
  return (
    <div
      className={`flex w-full flex-row items-center justify-between gap-4 rounded-lg px-2 py-1 ${
        isRentalDateValid(date) ? '' : 'bg-red-400/20'
      }`}
    >
      {/*Quantity*/}
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
        className="h-12 w-16 rounded-xl bg-white px-2 text-center text-2xl text-black outline-none"
      />
      <X />

      <DatePickerElem selected={date.start_date} onChange={onStartDateChange} />
      <Minus />

      <DatePickerElem
        selected={date.end_date}
        minDate={date.start_date ?? new Date()}
        onChange={onEndDateChange}
      />

      {/*Remove*/}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Usuń termin dla ${productName}`}
        className="rounded-lg p-2 transition-colors hover:bg-slate-500"
      >
        <Trash2 />
      </button>
    </div>
  );
}
