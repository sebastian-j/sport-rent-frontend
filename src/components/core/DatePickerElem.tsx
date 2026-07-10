import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { twMerge } from 'tailwind-merge';

type DatePickerElemProps = {
  selected: Date | null;
  minDate?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
};

export default function DatePickerElem({
  selected,
  minDate,
  onChange,
  placeholder,
  className,
  wrapperClassName,
}: DatePickerElemProps) {
  return (
    <DatePicker
      selected={selected}
      minDate={minDate ?? new Date()}
      onChange={(date: Date | null) => onChange(date)}
      dateFormat="dd.MM.yyyy"
      popperClassName="z-50"
      portalId="datepicker-popper-root"
      popperProps={{ strategy: 'fixed' }}
      wrapperClassName={twMerge('min-w-0 flex-1', wrapperClassName)}
      placeholderText={placeholder}
      className={twMerge(
        'box-border h-12 w-full select-none rounded-xl border border-transparent bg-app-surface px-4 text-center text-2xl text-app-text outline-none',
        className
      )}
    />
  );
}
