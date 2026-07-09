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
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative flex max-w-96 cursor-pointer select-none flex-row items-center gap-8 border border-app-border p-4 text-2xl font-semibold hover:z-10 ${selectedClasses}`}
    >
      <Icon size={48} strokeWidth={1} />
      <p>{title}</p>
    </motion.div>
  );
}
