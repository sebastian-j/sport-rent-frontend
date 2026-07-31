import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type SectionTitleProps = ComponentPropsWithoutRef<'h2'>;

export default function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <h2
      className={twMerge(
        'text-2xl font-semibold leading-tight text-app-textStrong sm:text-3xl',
        className
      )}
      {...props}
    />
  );
}
