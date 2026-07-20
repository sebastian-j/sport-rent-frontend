import PointsCard from './loyalty/PointsCard.tsx';
import { POINTS_ACQUISITIONS } from './loyalty/pointsAcquisitions.ts';

export default function LoyaltySection() {
  const pointsSum = POINTS_ACQUISITIONS.reduce((sum, acquisition) => sum + acquisition.amount, 0);

  return (
    <section className="flex w-full flex-col items-center justify-center pt-6 text-app-text min-[961px]:pt-12">
      <p className="text-center text-3xl min-[961px]:text-5xl">Program lojalnościowy</p>
      <p className="mt-4 text-center text-xl min-[961px]:text-3xl">
        Posiadasz <span className="font-semibold">{pointsSum}</span> punktów
      </p>
      <div className="my-6 flex w-full flex-col divide-y divide-app-borderSoft overflow-hidden rounded-xl border border-app-border min-[961px]:m-12 min-[961px]:max-w-[calc(100%-6rem)]">
        {POINTS_ACQUISITIONS.map((acquisition) => (
          <PointsCard key={acquisition.id} date={acquisition.date} amount={acquisition.amount} />
        ))}
      </div>
    </section>
  );
}
