import { motion, useReducedMotion } from 'motion/react';

import { formatPrice } from '../../utils/formatPrice.ts';
import type { PaymentMethod, PaymentMethodId } from './paymentMethods.ts';

type PaymentMethodOptionProps = {
  method: PaymentMethod;
  isSelected: boolean;
  pointsRequired: number;
  userPoints: number;
  isUserPointsLoading: boolean;
  hasUserPointsLoadError: boolean;
  onChange: (methodId: PaymentMethodId) => void;
};

export default function PaymentMethodOption({
  method,
  isSelected,
  pointsRequired,
  userPoints,
  isUserPointsLoading,
  hasUserPointsLoadError,
  onChange,
}: PaymentMethodOptionProps) {
  const isPointsPayment = method.id === 'points';
  const missingPoints = Math.max(0, pointsRequired - userPoints);
  const isDisabled =
    isPointsPayment && (isUserPointsLoading || hasUserPointsLoadError || missingPoints > 0);
  const hasPointsStatus = isUserPointsLoading || hasUserPointsLoadError || missingPoints > 0;
  const prefersReducedMotion = useReducedMotion();

  return (
    <label
      className={`flex min-w-0 w-full flex-wrap items-center gap-4 rounded-lg border p-4 transition-colors ${
        isDisabled
          ? 'cursor-not-allowed border-app-borderSoft bg-app-surfaceSoft'
          : 'cursor-pointer [@media(hover:hover)]:hover:bg-app-surface/60'
      } ${isSelected ? 'border-app-border bg-app-surface' : 'border-app-borderSoft'}`}
    >
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => onChange(method.id)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-app-surfaceStrong disabled:cursor-not-allowed"
      />
      <span className="font-medium text-app-textStrong">{method.name}</span>

      {isPointsPayment ? (
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="flex w-32 flex-col items-end text-right">
            <span className="font-medium text-app-textStrong">
              {pointsRequired.toLocaleString('pl-PL')} pkt
            </span>
            <motion.span
              className="block overflow-hidden"
              initial={false}
              animate={{ height: hasPointsStatus ? 20 : 0, opacity: hasPointsStatus ? 1 : 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {isUserPointsLoading ? (
                <span className="flex h-5 items-center" aria-label="Ładowanie liczby punktów">
                  <span
                    aria-hidden="true"
                    className="h-3 w-20 animate-pulse rounded-full bg-app-borderSoft"
                  />
                </span>
              ) : hasUserPointsLoadError ? (
                <span role="alert" className="text-sm text-app-danger">
                  Wystąpił błąd
                </span>
              ) : (
                missingPoints > 0 && (
                  <span className="text-sm text-app-textMuted">
                    Brakuje {missingPoints.toLocaleString('pl-PL')} pkt
                  </span>
                )
              )}
            </motion.span>
          </span>
        </span>
      ) : (
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={`flex h-10 min-w-0 shrink-0 items-center justify-end ${
              method.logos.length > 1
                ? 'w-[6.5rem] gap-2 min-[480px]:w-40'
                : 'w-12 min-[480px]:w-20'
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
          <span className="shrink-0 text-right text-app-textMuted">
            {formatPrice(method.price)}
          </span>
        </span>
      )}
    </label>
  );
}
