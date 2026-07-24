import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Ref } from 'react';

import { formatPrice } from '../../utils/formatPrice.ts';
import type { CartProduct, DateField, ProductInformation } from './cartTypes.ts';
import ProductRentalDate from './ProductRentalDate.tsx';

type CartProductCardProps = {
  product: CartProduct;
  information: ProductInformation;
  onQuantityChange: (dateId: number, quantity: number) => void;
  onSizeChange: (dateId: number, size: string) => void;
  onDateChange: (dateId: number, field: DateField, value: Date | null) => void;
  onRemoveDate: (dateId: number) => void;
  onAddDate: () => void;
  onRemoveProduct: () => void;
  getRentalDateRef?: (dateId: number) => Ref<HTMLDivElement>;
};

export default function CartProductCard({
  product,
  information,
  onQuantityChange,
  onSizeChange,
  onDateChange,
  onRemoveDate,
  onAddDate,
  onRemoveProduct,
  getRentalDateRef,
}: CartProductCardProps) {
  return (
    <article className="relative grid w-full grid-cols-1 gap-4 rounded-xl bg-app-cartCard p-4 text-app-textInverted md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:p-[1vw] lg:grid-rows-[auto_auto_auto_1fr]">
      <div className="mx-auto w-full max-w-xl self-start md:relative md:col-start-1 md:row-span-3 md:row-start-1 md:h-full md:min-h-0 md:max-w-none md:self-stretch lg:row-span-4">
        <img
          src={product.images[0]}
          alt={product.alt}
          className="h-auto w-full rounded-xl border-2 border-app-border object-contain md:absolute md:left-1/2 md:top-0 md:max-h-full md:max-w-full md:w-auto md:-translate-x-1/2"
        />
      </div>

      <p className="min-w-0 px-2 text-center text-2xl md:col-start-2 md:row-start-1 md:px-12 md:text-3xl lg:px-2 lg:pe-44 lg:text-left">
        {product.name}
      </p>

      <div className="flex h-fit self-start flex-col gap-3 overflow-hidden rounded-xl bg-app-cartCardInner/80 p-2 sm:p-4 md:col-span-2 md:row-start-4 md:gap-2 lg:col-span-1 lg:col-start-2 lg:row-start-2">
        {product.dates.map((date) => (
          <ProductRentalDate
            key={date.id}
            date={date}
            productName={product.name}
            productSizes={product.sizes}
            containerRef={getRentalDateRef?.(date.id)}
            onQuantityChange={(quantity) => onQuantityChange(date.id, quantity)}
            onSizeChange={(size) => onSizeChange(date.id, size)}
            onStartDateChange={(value) => onDateChange(date.id, 'start_date', value)}
            onEndDateChange={(value) => onDateChange(date.id, 'end_date', value)}
            onRemove={() => onRemoveDate(date.id)}
          />
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onAddDate}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className="flex h-10 items-center justify-center rounded-lg bg-app-cartCardInner/80 md:col-span-2 md:row-start-5 lg:col-span-1 lg:col-start-2 lg:row-start-3"
        aria-label="Dodaj kolejny termin"
      >
        <Plus size={28} />
      </motion.button>

      <div className="text-center text-lg md:col-start-2 md:row-start-2 lg:row-start-4 lg:text-left">
        <p>Dzienny koszt wypożyczenia: {formatPrice(product.price)}</p>
        <p>Liczba produktów: {information.totalQuantity}</p>
        <p>Liczba dni: {information.totalDays}</p>
      </div>

      <div className="flex h-10 items-center justify-center gap-3 md:col-start-2 md:row-start-3 lg:row-start-1 lg:justify-self-end lg:self-start lg:pe-12">
        <p className="text-2xl md:text-3xl">{formatPrice(information.totalCost)}</p>
        <button
          type="button"
          onClick={onRemoveProduct}
          aria-label={`Usuń ${product.name} z koszyka`}
          className="rounded-lg p-2 transition-colors hover:bg-app-cartCardInner/70 md:absolute md:right-[1vw] md:top-[1vw]"
        >
          <Trash2 />
        </button>
      </div>
    </article>
  );
}
