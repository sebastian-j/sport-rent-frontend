import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  hasError?: boolean;
  containerClassName?: string;
};

export default function AuthField({
  id,
  label,
  icon: Icon,
  hasError = false,
  containerClassName,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className={twMerge('block min-w-0', containerClassName)}>
      <span className="mb-2 block text-sm font-semibold text-app-textStrong">{label}</span>
      <span className="relative block">
        {Icon && (
          <Icon
            aria-hidden="true"
            size={18}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-app-textMuted"
          />
        )}
        <input
          {...props}
          id={id}
          className={twMerge(
            'h-12 w-full rounded-xl border border-app-borderSoft bg-app-surfaceElevated px-4 text-base text-app-text outline-none transition placeholder:text-app-textMuted/70 hover:border-app-border/70 focus:border-app-border focus:ring-2 focus:ring-app-border/20 disabled:cursor-not-allowed disabled:opacity-60',
            Icon ? 'pl-11' : '',
            hasError ? 'border-app-danger focus:border-app-danger focus:ring-app-danger/10' : '',
            className
          )}
        />
      </span>
    </label>
  );
}
