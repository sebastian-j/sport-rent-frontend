import PointsCard from './loyalty/PointsCard.tsx';
import { POINTS_ACQUISITIONS } from './loyalty/pointsAcquisitions.ts';

export default function LoyaltySection() {
  return (
    <section className="flex w-full flex-col items-center justify-center pt-12">
      <p className="text-5xl text-center">Program lojalnościowy</p>
      <p className="text-3xl mt-4">
        Posiadasz <span className="font-semibold">1567</span> punktów
      </p>
      <div className="m-12 flex w-full max-w-[calc(100%-6rem)] flex-col gap-0.5 overflow-hidden rounded-xl bg-slate-300">
        {POINTS_ACQUISITIONS.map((acquisition) => (
          <PointsCard key={acquisition.id} date={acquisition.date} amount={acquisition.amount} />
        ))}
      </div>
    </section>
  );
}
