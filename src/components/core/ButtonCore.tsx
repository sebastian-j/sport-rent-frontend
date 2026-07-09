import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { componentStyles } from './componentStyles.ts';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  inverted?: boolean;
  className?: string;
};

export default function ButtonCore({ text, onClick, inverted, className = '' }: ButtonProps) {
  const tone = inverted ? 'inversed' : 'default';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className={twMerge(
        'select-none',
        componentStyles.button.base,
        componentStyles.button.tone[tone],
        className
      )}
    >
      {text}
    </motion.button>
  );
}
