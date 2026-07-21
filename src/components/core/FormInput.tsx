import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      {...props}
      className={twMerge(
        'w-full rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border',
        className
      )}
    />
  );
}
