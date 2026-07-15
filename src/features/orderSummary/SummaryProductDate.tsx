type SummaryProductDateProps = {
  quantity: number;
  size: string | null;
  startDate: Date;
  endDate: Date;
};

const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export default function SummaryProductDate({
  quantity,
  size,
  startDate,
  endDate,
}: SummaryProductDateProps) {
  return (
    <p className="flex w-full items-baseline justify-between gap-3 text-base text-app-textMuted">
      <span className="shrink-0">
        {quantity} ×{size && ` ${size}`}
      </span>
      <span className="text-right">
        {dateFormatter.format(startDate)} – {dateFormatter.format(endDate)}
      </span>
    </p>
  );
}
