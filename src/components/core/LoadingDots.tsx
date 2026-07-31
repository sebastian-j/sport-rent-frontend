import { motion, useReducedMotion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

const DOT_COUNT = 3;
const DOT_DELAY_SECONDS = 0.12;
const WAVE_DURATION_SECONDS = 0.9;

type LoadingDotsProps = {
  className?: string;
  dotClassName?: string;
};

export default function LoadingDots({ className, dotClassName }: LoadingDotsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={twMerge('inline-flex items-baseline leading-none', className)}
    >
      {Array.from({ length: DOT_COUNT }, (_, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className={twMerge('inline-block', dotClassName)}
          animate={prefersReducedMotion ? undefined : { y: ['0em', '-0.35em', '0em', '0em'] }}
          transition={{
            duration: WAVE_DURATION_SECONDS,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: index * DOT_DELAY_SECONDS,
            times: [0, 0.3, 0.6, 1],
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
