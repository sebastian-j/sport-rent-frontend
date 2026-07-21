type PointsCardProps = {
  date: number;
  amount: number;
};

export default function PointsCard({ date, amount }: PointsCardProps) {
  const amountColor = amount > 0 ? 'text-app-success' : 'text-app-danger';

  return (
    <div className="grid min-h-16 w-full grid-cols-2 items-center bg-app-surfaceStrong p-3 text-[clamp(1.25rem,5cqi,2.25rem)] text-app-textInverted lg:min-h-24 lg:p-4">
      <p className="min-w-0 text-center">{new Date(date).toLocaleDateString('pl-PL')}</p>
      <p className={`min-w-0 text-center ${amountColor}`}>{amount}</p>
    </div>
  );
}
