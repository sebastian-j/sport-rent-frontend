export type PointsFilter = 'earned' | 'spent';

const FILTER_OPTIONS = [
  { value: 'earned', label: 'Zdobyte' },
  { value: 'spent', label: 'Wydane' },
] as const satisfies { value: PointsFilter; label: string }[];

type PointsFilterProps = {
  value: PointsFilter;
  onChange: (value: PointsFilter) => void;
  disabled?: boolean;
};

export default function PointsFilter({ value, onChange, disabled = false }: PointsFilterProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filtr historii punktów"
      className={`mx-auto mb-4 grid w-full grid-cols-2 rounded-lg bg-app-surfaceSoft p-1 lg:mb-6 lg:w-[calc(100%-6rem)] ${disabled ? 'opacity-50' : ''}`}
    >
      {FILTER_OPTIONS.map(({ value: optionValue, label }) => {
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(optionValue)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-app-surfaceStrong text-app-textInverted shadow-sm'
                : 'text-app-textMuted hover:text-app-text'
            } disabled:cursor-not-allowed`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
