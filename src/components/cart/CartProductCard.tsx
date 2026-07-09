import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import ProductRentalDate from './ProductRentalDate.tsx';
import type { RentalDate } from './rentalDate.ts';
import { formatPrice } from '../../utils/formatPrice.ts';
import type { Ref } from 'react';

type Product = (typeof import('../../assets/products/products.ts').PRODUCTS)[number];

export type CartProduct = Product & {
  dates: RentalDate[];
};

export type ProductInformation = {
  totalQuantity: number;
  totalDays: number;
  totalCost: number;
};

type DateField = 'start_date' | 'end_date';

type CartProductCardProps = {
  product: CartProduct;
  information: ProductInformation;
  onQuantityChange: (dateId: number, quantity: number) => void;
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
  onDateChange,
  onRemoveDate,
  onAddDate,
  onRemoveProduct,
  getRentalDateRef,
}: CartProductCardProps) {
  return (
    <div className="flex flex-row rounded-xl bg-slate-500 p-4 text-white">
      {/*Left image*/}
      <div className="w-1/4 shrink-0 self-start border-2 border-slate-950">
        <img src={product.image} alt={product.alt} className="h-full w-full object-contain" />
      </div>

      {/*Right*/}
      <div className="flex flex-1 flex-col">
        {/*Top row*/}
        <div className="flex w-full items-center justify-between px-4">
          <p className="text-3xl">{product.name}</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl">{formatPrice(information.totalCost)}</p>
            <button
              type="button"
              onClick={onRemoveProduct}
              aria-label={`Usuń ${product.name} z koszyka`}
              className="rounded-lg p-2 transition-colors hover:bg-slate-600"
            >
              <Trash2 />
            </button>
          </div>
        </div>

        {/*Products row*/}
        <div className="flex flex-col gap-2 bg-slate-600 px-4 py-2 mx-2 my-2 overflow-hidden rounded-xl">
          {product.dates.map((date) => (
            <ProductRentalDate
              key={date.id}
              date={date}
              productName={product.name}
              containerRef={getRentalDateRef?.(date.id)}
              onQuantityChange={(quantity) => onQuantityChange(date.id, quantity)}
              onStartDateChange={(value) => onDateChange(date.id, 'start_date', value)}
              onEndDateChange={(value) => onDateChange(date.id, 'end_date', value)}
              onRemove={() => onRemoveDate(date.id)}
            />
          ))}
        </div>

        {/*Add another date*/}
        <motion.button
          type="button"
          onClick={onAddDate}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="mx-2 mb-2 flex h-10 items-center justify-center rounded-lg bg-slate-600"
          aria-label="Dodaj kolejny termin"
        >
          <Plus size={28} />
        </motion.button>

        {/*Information*/}
        <div className="mx-2 text-lg">
          <p>Dzienny koszt wypożyczenia: {formatPrice(product.price)}</p>
          <p>Liczba produktów: {information.totalQuantity}</p>
          <p>Liczba dni: {information.totalDays}</p>
        </div>
      </div>
    </div>
  );
}
