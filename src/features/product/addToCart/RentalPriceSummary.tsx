import { formatPrice } from '../../../utils/formatPrice.ts';

type RentalPriceSummaryProps = {
  rentalDayCount: number;
  quantity: number;
  totalPrice: number;
};

export default function RentalPriceSummary({
  rentalDayCount,
  quantity,
  totalPrice,
}: RentalPriceSummaryProps) {
  const rentalDayLabel = rentalDayCount === 1 ? 'dzień' : 'dni';

  return (
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
  );
}
