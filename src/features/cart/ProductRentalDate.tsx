import { Minus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { forwardRef } from 'react';

import DatePickerElem from '../../components/core/DatePickerElem.tsx';
import Select from '../../components/core/Select.tsx';
import type { ProductProps } from '../product/productProps.ts';
import { isRentalDateValid, type RentalDate } from './rentalDate.ts';

type ProductRentalDateProps = {
  date: RentalDate;
  productName: string;
  productSizes?: ProductProps['sizes'];
  onQuantityChange: (quantity: number) => void;
  onSizeChange: (size: string) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRemove: () => void;
  removeDisabled?: boolean;
  isMergeTarget?: boolean;
  isLast?: boolean;
};

const ProductRentalDate = forwardRef<HTMLDivElement, ProductRentalDateProps>(
  function ProductRentalDate(
    {
      date,
      productName,
      productSizes,
      onQuantityChange,
      onSizeChange,
      onStartDateChange,
      onEndDateChange,
      onRemove,
      removeDisabled = false,
      isMergeTarget = false,
      isLast = false,
    },
    ref
  ) {
    const requiresSize = Boolean(productSizes?.length);

    return (
      <motion.div
        ref={ref}
        initial={{
          height: 0,
          marginBottom: 0,
          clipPath: 'inset(0 0 100% 0)',
        }}
        exit={{
          height: 0,
          marginBottom: 0,
          clipPath: 'inset(0 0 100% 0)',
        }}
        animate={
          isMergeTarget
            ? {
                height: 'auto',
                marginBottom: isLast ? 0 : 12,
                scale: [1, 1.025, 1],
                clipPath: 'inset(0 0 0% 0)',
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0)',
                  '0 0 0 4px rgba(34, 197, 94, 0.75)',
                  '0 0 0 0 rgba(34, 197, 94, 0)',
                ],
              }
            : {
                height: 'auto',
                marginBottom: isLast ? 0 : 12,
                scale: 1,
                clipPath: 'inset(0 0 0% 0)',
                boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)',
              }
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className={`relative grid w-full grid-cols-2 items-center gap-3 overflow-hidden rounded-lg border-2 border-app-textInverted/40 px-2 py-3 md:flex md:flex-row md:justify-between md:border-0 md:py-1 lg:gap-4 ${
          isRentalDateValid(date, requiresSize) ? '' : 'bg-app-danger/20'
        }`}
      >
        <AnimatePresence>
          {isMergeTarget && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute right-2 top-1 z-10 rounded-full bg-app-success px-2 py-0.5 text-xs font-semibold text-white"
            >
              Scalono terminy
            </motion.span>
          )}
        </AnimatePresence>
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
            onChange={onEndDateChange}
            placeholder="Data końcowa"
            className="px-2 text-sm xl:px-4 xl:text-lg"
            wrapperClassName="md:w-auto md:flex-1"
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          aria-label={`Usuń termin dla ${productName}`}
          className="col-span-2 self-center justify-self-center rounded-lg p-2 transition-colors hover:bg-app-cartCard disabled:cursor-wait disabled:opacity-60 md:col-span-1 md:self-auto"
        >
          <Trash2 />
        </button>
      </motion.div>
    );
  }
);

export default ProductRentalDate;
