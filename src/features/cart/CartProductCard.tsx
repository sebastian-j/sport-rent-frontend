import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import ProductRentalDate from './ProductRentalDate.tsx';
import { formatPrice } from '../../utils/formatPrice.ts';
import type { Ref } from 'react';
import type { CartProduct, DateField, ProductInformation } from './cartTypes.ts';

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
    <div className="flex w-full flex-row rounded-xl bg-app-cartCard p-[1vw] text-app-textInverted">
      {/*Left image*/}
      <div className="w-1/4 shrink-0 self-start border-2 border-app-border rounded-xl overflow-hidden">
        <img src={product.image} alt={product.alt} className="h-full w-full object-contain" />
      </div>

      {/*Right*/}
      <div className="flex flex-1 flex-col ms-4">
        {/*Top row*/}
        <div className="flex w-full items-center justify-between px-[1vw]">
          <p className="text-3xl">{product.name}</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl">{formatPrice(information.totalCost)}</p>
            <button
              type="button"
              onClick={onRemoveProduct}
              aria-label={`Usuń ${product.name} z koszyka`}
              className="rounded-lg p-2 transition-colors hover:bg-app-cartCardInner/70"
            >
              <Trash2 />
            </button>
          </div>
        </div>

        {/*Products row*/}
        <div className="mx-[2vh] my-[1vh] flex flex-col gap-2 overflow-hidden rounded-xl bg-app-cartCardInner/80 px-[2vh] py-[1vh]">
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

        {/*Add another date*/}
        <motion.button
          type="button"
          onClick={onAddDate}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="mx-[2vh] mb-2 flex h-10 items-center justify-center rounded-lg bg-app-cartCardInner/80"
          aria-label="Dodaj kolejny termin"
        >
          <Plus size={28} />
        </motion.button>

        {/*Information*/}
        <div className="mx-[1vw] text-lg">
          <p>Dzienny koszt wypożyczenia: {formatPrice(product.price)}</p>
          <p>Liczba produktów: {information.totalQuantity}</p>
          <p>Liczba dni: {information.totalDays}</p>
        </div>
      </div>
    </div>
  );
}
