import PointsCard from './loyalty/PointsCard.tsx';
import { POINTS_ACQUISITIONS } from './loyalty/pointsAcquisitions.ts';

export default function LoyaltySection() {
  const pointsSum = POINTS_ACQUISITIONS.reduce((sum, acquisition) => sum + acquisition.amount, 0);

  return (
    <section className="flex w-full flex-col items-center justify-center pt-12 text-app-text">
      <p className="text-center text-5xl">Program lojalnościowy</p>
      <p className="mt-4 text-3xl">
        Posiadasz <span className="font-semibold">{pointsSum}</span> punktów
      </p>
      <div className="m-12 flex w-full max-w-[calc(100%-6rem)] flex-col gap-0.5 overflow-hidden rounded-xl bg-app-surfaceSoft">
        {POINTS_ACQUISITIONS.map((acquisition) => (
          <PointsCard key={acquisition.id} date={acquisition.date} amount={acquisition.amount} />
        ))}
      </div>
    </section>
  );
}
