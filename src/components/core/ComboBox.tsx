import { twMerge } from 'tailwind-merge';

export type ComboBoxOption = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  value: string;
  options: readonly ComboBoxOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
};

export default function ComboBox({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  className,
}: ComboBoxProps) {
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
