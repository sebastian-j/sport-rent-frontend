import { LoaderCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type ActivityIndicatorProps = {
  label?: string;
  size?: number;
  className?: string;
};

export default function ActivityIndicator({
  label = 'Ładowanie',
  size = 24,
  className,
}: ActivityIndicatorProps) {
  return (
    <span role="status" aria-label={label} className={twMerge('inline-flex', className)}>
      <LoaderCircle size={size} aria-hidden="true" className="animate-spin" />
    </span>
  );
}
