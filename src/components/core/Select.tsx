import { twMerge } from 'tailwind-merge';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
};

export default function Select({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  className,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      aria-label={ariaLabel}
      className={twMerge(
        'h-12 w-20 rounded-xl bg-app-surface px-2 text-center text-2xl text-app-text outline-none',
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
