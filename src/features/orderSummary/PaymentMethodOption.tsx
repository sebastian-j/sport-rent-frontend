import { formatPrice } from '../../utils/formatPrice.ts';
import type { PaymentMethod, PaymentMethodId } from './paymentMethods.ts';

type PaymentMethodOptionProps = {
  method: PaymentMethod;
  isSelected: boolean;
  onChange: (methodId: PaymentMethodId) => void;
};

export default function PaymentMethodOption({
  method,
  isSelected,
  onChange,
}: PaymentMethodOptionProps) {
  return (
    <label
      className={`flex min-w-0 w-full cursor-pointer flex-wrap items-center gap-4 rounded-lg border p-4 transition-colors [@media(hover:hover)]:hover:bg-app-surface/60 ${isSelected ? 'border-app-border bg-app-surface' : 'border-app-borderSoft'}`}
    >
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={isSelected}
        onChange={() => onChange(method.id)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-app-surfaceStrong"
      />
      <span className="font-medium text-app-textStrong">{method.name}</span>

      <span className="ml-auto flex shrink-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={`flex h-10 min-w-0 shrink-0 items-center justify-end ${
            method.logos.length > 1 ? 'w-[6.5rem] gap-2 min-[480px]:w-40' : 'w-12 min-[480px]:w-20'
          }`}
        >
          {method.logos.map((logo) => (
            <img
              key={logo}
              src={logo}
              alt=""
              className={`h-auto w-12 shrink-0 object-contain ${
                isSelected ? '' : 'grayscale'
              } transition-[filter]`}
            />
          ))}
        </span>
        <span className="shrink-0 text-right text-app-textMuted">{formatPrice(method.price)}</span>
      </span>
    </label>
  );
}
