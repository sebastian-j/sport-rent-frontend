import PointsCard from './loyalty/PointsCard.tsx';

type PointsAcquisition = {
  id: number;
  date: number;
  amount: number;
};

const POINTS_ACQUISITIONS: PointsAcquisition[] = [
  {
    id: 1,
    date: new Date('2026-06-28').getTime(),
    amount: -54,
  },
  {
    id: 2,
    date: new Date('2026-06-14').getTime(),
    amount: 120,
  },
  {
    id: 3,
    date: new Date('2026-05-30').getTime(),
    amount: 89,
  },
  {
    id: 4,
    date: new Date('2026-05-12').getTime(),
    amount: -45,
  },
  {
    id: 5,
    date: new Date('2026-04-26').getTime(),
    amount: 178,
  },
  {
    id: 6,
    date: new Date('2026-04-05').getTime(),
    amount: -69,
  },
  {
    id: 7,
    date: new Date('2026-03-21').getTime(),
    amount: -99,
  },
  {
    id: 8,
    date: new Date('2026-03-02').getTime(),
    amount: 35,
  },
  {
    id: 9,
    date: new Date('2026-02-16').getTime(),
    amount: 149,
  },
  {
    id: 10,
    date: new Date('2026-01-29').getTime(),
    amount: 75,
  },
  {
    id: 11,
    date: new Date('2026-01-11').getTime(),
    amount: -64,
  },
  {
    id: 12,
    date: new Date('2025-12-20').getTime(),
    amount: 110,
  },
];

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
