import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

type ProfileCardProps = {
  title: string;
  icon: LucideIcon;
  selected: boolean;
  onClick?: () => void;
};

export default function ProfileCard({ title, icon: Icon, selected, onClick }: ProfileCardProps) {
  const selectedClasses = selected
    ? 'bg-app-surfaceStrong text-app-textInverted'
    : 'bg-app-surfaceSoft text-app-text';

  return (
    <motion.button
      type="button"
      aria-label={title}
      aria-pressed={selected}
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative flex min-h-16 min-w-0 flex-1 cursor-pointer select-none flex-row items-center justify-center border border-app-border p-3 font-semibold hover:z-10 md:flex-col md:gap-2 lg:w-full lg:max-w-96 lg:flex-none lg:flex-row lg:justify-start lg:gap-8 lg:p-4 lg:text-2xl ${selectedClasses}`}
    >
      <Icon className="h-8 w-8 shrink-0 lg:h-12 lg:w-12" strokeWidth={1} />
      <span className="hidden min-w-0 text-center leading-tight md:block lg:text-left">
        {title}
      </span>
    </motion.button>
  );
}
