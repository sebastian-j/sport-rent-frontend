type PointsCardProps = {
  date: number;
  amount: number;
};

export default function PointsCard({ date, amount }: PointsCardProps) {
  const amountColor = amount > 0 ? 'text-app-success' : 'text-app-danger';

  return (
    <div className="flex min-h-16 w-full flex-row items-center justify-center bg-app-surfaceStrong p-3 text-xl text-app-textInverted min-[961px]:min-h-24 min-[961px]:p-4 min-[961px]:text-4xl">
      <p className="min-w-0 flex-1 text-center">{new Date(date).toLocaleDateString('pl-PL')}</p>
      <p className={`min-w-0 flex-1 text-center ${amountColor}`}>{amount}</p>
    </div>
  );
}
