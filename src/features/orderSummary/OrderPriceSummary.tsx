import ButtonCore from '../../components/core/ButtonCore.tsx';
import { formatPrice } from '../../utils/formatPrice.ts';

type OrderPriceSummaryProps = {
  cartPrice: number;
  paymentPrice?: number;
  discount?: number;
  onBuy?: () => void;
};

export default function OrderPriceSummary({
  cartPrice,
  paymentPrice,
  discount = 0,
  onBuy,
}: OrderPriceSummaryProps) {
  const totalPrice = cartPrice + (paymentPrice ?? 0) - discount;

  return (
    <div className="flex w-full flex-col gap-3 border-t border-app-borderSoft pt-5">
      <p className="flex items-center justify-between gap-4">
        <span>Cena koszyka</span>
        <span className="font-medium">{formatPrice(cartPrice)}</span>
      </p>

      <p className="flex items-center justify-between gap-4">
        <span>Płatność</span>
        <span className="font-medium">
          {paymentPrice === undefined ? '—' : formatPrice(paymentPrice)}
        </span>
      </p>

      {discount > 0 && (
        <p className="flex items-center justify-between gap-4 text-app-success">
          <span>Rabat</span>
          <span className="font-medium">−{formatPrice(discount)}</span>
        </p>
      )}

      <p className="mt-1 flex items-center justify-between gap-4 border-t border-app-borderSoft pt-4 text-xl font-semibold text-app-textStrong">
        <span>Razem</span>
        <span>{formatPrice(totalPrice)}</span>
      </p>

      <ButtonCore
        text="Kupuję i płacę"
        onClick={onBuy}
        className="mt-2 flex h-12 w-full items-center justify-center text-lg font-semibold"
      />
    </div>
  );
}
