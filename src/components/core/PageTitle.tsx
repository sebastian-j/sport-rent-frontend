import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type PageTitleProps = ComponentPropsWithoutRef<'h1'>;

export default function PageTitle({ className, ...props }: PageTitleProps) {
  return (
    <h1
      className={twMerge(
        'text-3xl font-semibold leading-tight tracking-tight text-app-textStrong sm:text-4xl lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}
