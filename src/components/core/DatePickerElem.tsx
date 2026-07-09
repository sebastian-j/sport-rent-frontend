import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerElemProps = {
  selected: Date | null;
  minDate?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function DatePickerElem({
  selected,
  minDate,
  onChange,
  placeholder,
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
      wrapperClassName="min-w-0 flex-1"
      placeholderText={placeholder}
      className="box-border h-12 w-full rounded-xl border border-transparent bg-white px-4 text-black outline-none text-2xl text-center select-none"
    />
  );
}
