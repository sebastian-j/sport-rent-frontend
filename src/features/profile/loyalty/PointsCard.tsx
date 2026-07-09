type PointsCardProps = {
  date: number;
  amount: number;
};

export default function PointsCard({ date, amount }: PointsCardProps) {
  const amountColor = amount > 0 ? 'text-green-300' : 'text-red-300';

  return (
    <div className="flex min-h-24 w-full flex-row flex-wrap items-center justify-center bg-slate-800 p-4 text-4xl text-white">
      <p className="min-w-52 flex-1 text-center">{new Date(date).toLocaleDateString('pl-PL')}</p>
      <p className={`min-w-52 flex-1 text-center ${amountColor}`}>{amount}</p>
    </div>
  );
}
