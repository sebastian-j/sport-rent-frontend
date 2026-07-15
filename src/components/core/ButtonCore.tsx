import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { componentStyles } from './componentStyles.ts';
import type { ReactNode } from 'react';

type ButtonProps = {
  text?: string;
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  inverted?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

export default function ButtonCore({
  text,
  children,
  onClick,
  inverted,
  disabled = false,
  ariaLabel,
  type = 'button',
  className = '',
}: ButtonProps) {
  const tone = inverted ? 'inversed' : 'default';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className={twMerge(
        'select-none',
        componentStyles.button.base,
        componentStyles.button.tone[tone],
        className
      )}
    >
      {children ?? text}
    </motion.button>
  );
}
