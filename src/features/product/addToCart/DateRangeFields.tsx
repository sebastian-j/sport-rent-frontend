import DatePickerElem from '../../../components/core/DatePickerElem.tsx';

type DateRangeFieldsProps = {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
};

const DATE_INPUT_CLASSES =
  'h-auto rounded-lg border border-app-borderSoft bg-app-surface p-2 text-left text-base font-semibold text-app-text';

export default function DateRangeFields({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFieldsProps) {
  return (
    <div className="grid w-full max-w-xl grid-cols-2 gap-x-3 gap-y-1">
      <p className="text-base font-semibold text-app-text">Data rozpoczęcia</p>
      <p className="text-base font-semibold text-app-text">Data zakończenia</p>
      <DatePickerElem
        selected={startDate}
        onChange={(date) => date && onStartDateChange(date)}
        minDate={new Date()}
        wrapperClassName="w-full min-w-0"
        className={DATE_INPUT_CLASSES}
      />
      <DatePickerElem
        selected={endDate}
        onChange={(date) => date && onEndDateChange(date)}
        minDate={startDate}
        wrapperClassName="w-full min-w-0"
        className={DATE_INPUT_CLASSES}
      />
    </div>
  );
}
