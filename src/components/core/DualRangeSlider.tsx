import { twMerge } from 'tailwind-merge';
import ButtonCore from './ButtonCore.tsx';

type DualRangeSliderProps = {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
};

const RANGE_INPUT_CLASS =
  'pointer-events-none absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-app-surfaceStrong [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-app-surfaceStrong';

export default function DualRangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  onChangeEnd,
  step = 1,
  formatValue = String,
  className,
}: DualRangeSliderProps) {
  const [startValue, endValue] = value;
  const range = Math.max(1, max - min);
  const startPosition = ((startValue - min) / range) * 100;
  const endPosition = ((endValue - min) / range) * 100;
  const isFullRange = startValue === min && endValue === max;
  const getStartRange = (nextStartValue: number): [number, number] => [
    Math.min(nextStartValue, endValue),
    endValue,
  ];
  const getEndRange = (nextEndValue: number): [number, number] => [
    startValue,
    Math.max(nextEndValue, startValue),
  ];
  const resetRange = () => {
    const fullRange: [number, number] = [min, max];
    onChange(fullRange);
    onChangeEnd?.(fullRange);
  };

  return (
    <div className={twMerge('w-full', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-app-text">{label}</span>
        <span className="whitespace-nowrap text-sm text-app-textMuted">
          {formatValue(startValue)} – {formatValue(endValue)}
        </span>
      </div>

      <div className="relative h-6 w-full">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-app-borderSoft" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-app-surfaceStrong"
          style={{ left: `${startPosition}%`, right: `${100 - endPosition}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={startValue}
          onChange={(event) => onChange(getStartRange(Number(event.currentTarget.value)))}
          onPointerUp={(event) => onChangeEnd?.(getStartRange(Number(event.currentTarget.value)))}
          onKeyUp={(event) => onChangeEnd?.(getStartRange(Number(event.currentTarget.value)))}
          onBlur={(event) => onChangeEnd?.(getStartRange(Number(event.currentTarget.value)))}
          aria-label={`${label}: wartość minimalna`}
          className={twMerge(RANGE_INPUT_CLASS, startValue === max ? 'z-30' : 'z-20')}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={endValue}
          onChange={(event) => onChange(getEndRange(Number(event.currentTarget.value)))}
          onPointerUp={(event) => onChangeEnd?.(getEndRange(Number(event.currentTarget.value)))}
          onKeyUp={(event) => onChangeEnd?.(getEndRange(Number(event.currentTarget.value)))}
          onBlur={(event) => onChangeEnd?.(getEndRange(Number(event.currentTarget.value)))}
          aria-label={`${label}: wartość maksymalna`}
          className={twMerge(RANGE_INPUT_CLASS, 'z-20')}
        />
      </div>

      <div className="flex h-5 items-center justify-center">
        {!isFullRange && (
          <ButtonCore
            text="Zresetuj"
            onClick={resetRange}
            className="bg-transparent text-xs text-app-textMuted hover:underline"
          />
        )}
      </div>
    </div>
  );
}
