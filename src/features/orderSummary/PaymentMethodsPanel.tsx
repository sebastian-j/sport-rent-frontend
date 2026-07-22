import { PAYMENT_METHODS, type PaymentMethodId } from './paymentMethods.ts';
import PaymentMethodOption from './PaymentMethodOption.tsx';

type PaymentMethodsPanelProps = {
  selectedMethodId?: PaymentMethodId;
  pointsRequired: number;
  userPoints: number;
  isUserPointsLoading: boolean;
  hasUserPointsLoadError: boolean;
  onMethodChange: (methodId: PaymentMethodId) => void;
};

export default function PaymentMethodsPanel({
  selectedMethodId,
  pointsRequired,
  userPoints,
  isUserPointsLoading,
  hasUserPointsLoadError,
  onMethodChange,
}: PaymentMethodsPanelProps) {
  return (
    <fieldset className="flex min-w-0 w-full flex-col gap-3">
      <legend className="mb-3 w-full text-center text-2xl font-semibold text-app-textStrong">
        Płatność
      </legend>

      {PAYMENT_METHODS.map((method) => (
        <PaymentMethodOption
          key={method.id}
          method={method}
          isSelected={selectedMethodId === method.id}
          pointsRequired={pointsRequired}
          userPoints={userPoints}
          isUserPointsLoading={isUserPointsLoading}
          hasUserPointsLoadError={hasUserPointsLoadError}
          onChange={onMethodChange}
        />
      ))}
    </fieldset>
  );
}
