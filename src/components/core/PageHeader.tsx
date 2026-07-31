import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import PageTitle from './PageTitle.tsx';

type PageHeaderProps = ComponentPropsWithoutRef<'header'> & {
  titleClassName?: string;
};

export default function PageHeader({
  children,
  className,
  titleClassName,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={twMerge('px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12', className)}
      {...props}
    >
      <PageTitle className={twMerge('text-center', titleClassName)}>{children}</PageTitle>
    </header>
  );
}
