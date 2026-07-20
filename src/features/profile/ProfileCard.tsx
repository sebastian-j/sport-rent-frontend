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
      className={`relative flex min-h-16 min-w-0 flex-1 cursor-pointer select-none flex-row items-center justify-center border border-app-border p-3 font-semibold hover:z-10 min-[961px]:w-full min-[961px]:max-w-96 min-[961px]:flex-none min-[961px]:justify-start min-[961px]:gap-8 min-[961px]:p-4 min-[961px]:text-2xl ${selectedClasses}`}
    >
      <Icon className="h-8 w-8 shrink-0 min-[961px]:h-12 min-[961px]:w-12" strokeWidth={1} />
      <span className="hidden min-[961px]:block">{title}</span>
    </motion.button>
  );
}
