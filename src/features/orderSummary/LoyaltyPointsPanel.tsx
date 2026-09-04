import { formatPrice } from '../../utils/formatPrice.ts';
import { POINTS_REQUIRED_PER_PLN } from '../loyalty/constants.ts';

type LoyaltyPointsPanelProps = {
  balance: number;
  pointsToSpend: number;
  maximumPointsForOrder: number;
  lifetimeQualifyingSpend: number;
  unlockSpendRequired: number;
  redemptionUnlocked: boolean;
  isLoading: boolean;
  loadError: string | null;
  onPointsChange: (points: number) => void;
};

export default function LoyaltyPointsPanel({
  balance,
  pointsToSpend,
  maximumPointsForOrder,
  lifetimeQualifyingSpend,
  unlockSpendRequired,
  redemptionUnlocked,
  isLoading,
  loadError,
  onPointsChange,
}: LoyaltyPointsPanelProps) {
  const remainingSpend = Math.max(0, unlockSpendRequired - lifetimeQualifyingSpend);
  const isDisabled =
    isLoading || loadError !== null || !redemptionUnlocked || maximumPointsForOrder === 0;

  const handleChange = (value: string) => {
    const parsedValue = Number(value);
    const points = Number.isFinite(parsedValue) ? Math.floor(parsedValue) : 0;
    onPointsChange(Math.min(maximumPointsForOrder, Math.max(0, points)));
  };

  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="text-center text-2xl font-semibold text-app-textStrong">
        Punkty lojalnościowe
      </h2>

      {isLoading ? (
        <p role="status" className="text-sm text-app-textMuted">
          Ładowanie punktów...
        </p>
      ) : loadError ? (
        <p role="alert" className="text-sm text-app-danger">
          {loadError}
        </p>
      ) : !redemptionUnlocked ? (
        <div className="rounded-lg border border-app-borderSoft bg-app-surfaceSoft p-4 text-sm text-app-textMuted">
          <p className="font-medium text-app-textStrong">Program lojalnościowy jest zablokowany.</p>
          <p>
            Odblokuje się po wydaniu {formatPrice(unlockSpendRequired)}. Pozostało{' '}
            {formatPrice(remainingSpend)}.
          </p>
        </div>
      ) : (
        <>
          <label className="flex flex-col gap-2 text-app-textStrong" htmlFor="points-to-spend">
            <span className="font-medium">Ile punktów chcesz wykorzystać?</span>
            <input
              id="points-to-spend"
              type="number"
              min={0}
              max={maximumPointsForOrder}
              step={1}
              value={pointsToSpend}
              disabled={isDisabled}
              onChange={(event) => handleChange(event.target.value)}
              className="rounded-lg border border-app-borderSoft bg-app-background px-3 py-2 text-app-textStrong disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <div className="flex flex-col gap-1 text-sm text-app-textMuted">
            <p>Dostępne punkty: {balance.toLocaleString('pl-PL')}</p>
            <p>
              Maksymalnie dla tego zamówienia: {maximumPointsForOrder.toLocaleString('pl-PL')} pkt
            </p>
            <p>Rabat z punktów: {formatPrice(pointsToSpend / POINTS_REQUIRED_PER_PLN)}</p>
          </div>
        </>
      )}
    </section>
  );
}
