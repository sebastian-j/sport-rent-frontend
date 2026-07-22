import PaymentMethodOption from './PaymentMethodOption.tsx';
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
          onChange={onMethodChange}
        />
      ))}
    </fieldset>
  );
}
