import { POINTS_ACQUISITIONS } from './loyalty/pointsAcquisitions.ts';
import PointsCard from './loyalty/PointsCard.tsx';

export default function LoyaltySection() {
  const pointsSum = POINTS_ACQUISITIONS.reduce((sum, acquisition) => sum + acquisition.amount, 0);

  return (
    <section className="flex w-full flex-col items-center justify-center pt-6 text-app-text [container-type:inline-size] lg:pt-12">
      <p className="w-full text-center text-[clamp(1.875rem,8cqi,3rem)] leading-tight">
        Program lojalnościowy
      </p>
      <p className="mt-4 w-full text-center text-[clamp(1.25rem,5cqi,1.875rem)] leading-tight">
        Posiadasz <span className="font-semibold">{pointsSum}</span> punktów
      </p>
      <div className="mx-auto my-6 flex w-full flex-col divide-y divide-app-borderSoft overflow-hidden rounded-xl border border-app-border lg:my-12 lg:w-[calc(100%-6rem)]">
        {POINTS_ACQUISITIONS.map((acquisition) => (
          <PointsCard key={acquisition.id} date={acquisition.date} amount={acquisition.amount} />
        ))}
      </div>
    </section>
  );
}
