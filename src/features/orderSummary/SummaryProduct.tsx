import type { CartProduct } from '../cart/cartTypes.ts';
import { isRentalDateValid } from '../cart/rentalDate.ts';
import SummaryProductDate from './SummaryProductDate.tsx';

type SummaryProductProps = {
  product: CartProduct;
};

export default function SummaryProduct({ product }: SummaryProductProps) {
  const requiresSize = Boolean(product.sizes?.length);
  const selectedDates = product.dates.filter((date) => isRentalDateValid(date, requiresSize));

  return (
    <article className="flex w-full flex-col gap-4">
      <div className="flex items-start gap-4">
        <img
          src={product.images[0]}
          alt={product.alt}
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
        <p className="min-w-0 flex-1 text-lg font-semibold text-app-textStrong">{product.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        {selectedDates.map((date) => (
          <SummaryProductDate
            key={date.id}
            quantity={date.quantity}
            size={date.size}
            startDate={date.start_date}
            endDate={date.end_date}
          />
        ))}
      </div>
    </article>
  );
}
