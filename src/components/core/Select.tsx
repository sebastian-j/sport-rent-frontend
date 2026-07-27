import { twMerge } from 'tailwind-merge';

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
};

type SelectProps<Value extends string> = {
  value: Value;
  options: readonly SelectOption<Value>[];
  onChange: (value: Value) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
};

export default function Select<Value extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  className,
}: SelectProps<Value>) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.currentTarget.value as Value)}
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
