import { formatPrice } from '../../utils/formatPrice.ts';
import { PAYMENT_METHODS, type PaymentMethodId } from './paymentMethods.ts';

type PaymentMethodsPanelProps = {
  selectedMethodId?: PaymentMethodId;
  pointsRequired: number;
  userPoints: number;
  onMethodChange: (methodId: PaymentMethodId) => void;
};

export default function PaymentMethodsPanel({
  selectedMethodId,
  pointsRequired,
  userPoints,
  onMethodChange,
}: PaymentMethodsPanelProps) {
  return (
    <fieldset className="flex w-full flex-col gap-3">
      <legend className="mb-3 w-full text-center text-2xl font-semibold text-app-textStrong">
        Płatność
      </legend>

      {PAYMENT_METHODS.map((method) => {
        const isPointsPayment = method.id === 'points';
        const missingPoints = Math.max(0, pointsRequired - userPoints);
        const isDisabled = isPointsPayment && missingPoints > 0;
        const logos = (
          <span
            aria-hidden="true"
            className={`flex h-10 shrink-0 items-center justify-end ${
              method.logos.length > 1 ? 'w-40 gap-2' : 'w-20'
            }`}
          >
            {method.logos.map((logo) => (
              <img
                key={logo}
                src={logo}
                alt=""
                className={`h-auto w-12 shrink-0 object-contain ${
                  selectedMethodId === method.id ? '' : 'grayscale'
                } transition-[filter]}`}
              />
            ))}
          </span>
        );

        return (
          <label
            key={method.id}
            className={`flex w-full items-center gap-4 rounded-lg border p-4 transition-colors ${
              isDisabled
                ? 'cursor-not-allowed border-app-borderSoft bg-app-surfaceSoft'
                : 'cursor-pointer hover:bg-app-surface/60'
            } ${
              selectedMethodId === method.id
                ? 'border-app-border bg-app-surface'
                : 'border-app-borderSoft'
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethodId === method.id}
              disabled={isDisabled}
              onChange={() => onMethodChange(method.id)}
              className="h-5 w-5 shrink-0 cursor-pointer accent-app-surfaceStrong disabled:cursor-not-allowed"
            />
            <span className="font-medium text-app-textStrong">{method.name}</span>

            {isPointsPayment ? (
              <span className="ml-auto flex shrink-0 items-center gap-2">
                <span className="flex w-28 flex-col items-end text-right">
                  <span className="font-medium text-app-textStrong">
                    {pointsRequired.toLocaleString('pl-PL')} pkt
                  </span>
                  {missingPoints > 0 && (
                    <span className="text-sm text-app-textMuted">
                      Brakuje {missingPoints.toLocaleString('pl-PL')} pkt
                    </span>
                  )}
                </span>
              </span>
            ) : (
              <span className="ml-auto flex shrink-0 items-center gap-2">
                {logos}
                <span className="shrink-0 text-right text-app-textMuted">
                  {formatPrice(method.price)}
                </span>
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
