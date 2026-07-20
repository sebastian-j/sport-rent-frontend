import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef, useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const MOBILE_MEDIA_QUERY = '(max-width: 960px)';

type MobileDateInputProps = ComponentPropsWithoutRef<'button'> & {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
};

const MobileDateInput = forwardRef<HTMLButtonElement, MobileDateInputProps>(
  function MobileDateInput({ value, placeholder, readOnly: _readOnly, ...props }, ref) {
    return (
      <button {...props} ref={ref} type="button" aria-haspopup="dialog">
        {value || placeholder}
      </button>
    );
  }
);

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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(MOBILE_MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mobileMedia = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleBreakpointChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    mobileMedia.addEventListener('change', handleBreakpointChange);

    return () => mobileMedia.removeEventListener('change', handleBreakpointChange);
  }, []);

  return (
    <DatePicker
      selected={selected}
      minDate={minDate ?? new Date()}
      onChange={(date: Date | null) => onChange(date)}
      dateFormat="dd.MM.yyyy"
      popperClassName="z-50"
      portalId="datepicker-popper-root"
      popperProps={{ strategy: 'fixed' }}
      withPortal={isMobile}
      customInput={isMobile ? <MobileDateInput /> : undefined}
      wrapperClassName={twMerge('min-w-0 flex-1', wrapperClassName)}
      placeholderText={placeholder}
      className={twMerge(
        'box-border h-12 w-full select-none rounded-xl border border-transparent bg-app-surface px-4 text-center text-2xl text-app-text outline-none',
        className
      )}
    />
  );
}
